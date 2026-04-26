import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import NodeCache from 'node-cache';

const router = express.Router();
const cache = new NodeCache({ stdTTL: 300 }); // 5-minute TTL

const getGenAI = () => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY not set in environment variables');
    }
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

// Store conversation history per session (in-memory; use Redis for production)
const sessions = new Map();

// ── POST /api/chat ─────────────────────────────────
router.post('/', async (req, res) => {
    const { message, sessionId, context } = req.body;

    if (!message?.trim()) {
        return res.status(400).json({ error: 'Message is required' });
    }

    // Check cache for identical queries (no personal context)
    const cacheKey = `chat_${message.toLowerCase().trim()}`;
    if (!context?.product && cache.has(cacheKey)) {
        return res.json({ reply: cache.get(cacheKey), sessionId });
    }

    try {
        const genAI = getGenAI();
        const id = sessionId || 'default';

        if (!sessions.has(id)) sessions.set(id, []);
        const history = sessions.get(id);

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: `
You are GreenBot, a friendly and helpful assistant for GreenCart — a modern online grocery store in India.

Your capabilities:
- Help users find products, suggest alternatives, explain ingredients
- Answer questions about delivery, returns, payments, and account
- Suggest healthy meal ideas and recipes based on available products
- Help with order tracking and issues
- Recommend products based on dietary needs (vegan, diabetic-friendly, etc.)
- Explain offers and discounts
- Assist with navigating the website

Use Indian grocery context (₹ currency, local produce names like dal, paneer, roti, etc.).
Tone: Warm, conversational, helpful. Keep responses concise (2-3 sentences max) unless asked for more detail.
If you don't know something specific about an order or user data, say so honestly.
            `.trim(),
        });

        const chat = model.startChat({ history });

        const contextualMessage = context?.page
            ? `[User is on: ${context.page}${context.product ? ` | Viewing: ${context.product}` : ''}]\n\nUser says: ${message}`
            : message;

        const result = await chat.sendMessage(contextualMessage);
        const reply = result.response.text();

        // Update history
        history.push({ role: 'user', parts: [{ text: message }] });
        history.push({ role: 'model', parts: [{ text: reply }] });

        // Keep last 20 messages (10 pairs)
        if (history.length > 20) history.splice(0, 2);
        sessions.set(id, history);

        // Cache generic replies
        if (!context?.product) {
            cache.set(cacheKey, reply);
        }

        res.json({ reply, sessionId: id });
    } catch (error) {
        console.error('Gemini chat error:', error.message);
        res.status(500).json({ error: 'GreenBot is temporarily unavailable. Please try again.' });
    }
});

export default router;
