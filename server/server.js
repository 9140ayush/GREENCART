import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import chatRouter from './routes/chat.js';
import aiRouter from './routes/aiRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';

const app = express();
const port = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();

// ── Allowed Origins ────────────────────────────────
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://greencart-six-pi.vercel.app',
];

// ── Stripe Webhook (raw body before json middleware) ─
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// ── Security Middleware ────────────────────────────
app.use(helmet({
    contentSecurityPolicy: false, // Disabled for Cloudinary image compatibility
    crossOriginEmbedderPolicy: false,
}));

// ── Rate Limiting ──────────────────────────────────
const chatLimiter = rateLimit({
    windowMs: 60 * 1000,  // 1 minute
    max: 20,               // 20 requests per IP per minute
    message: { error: 'Too many requests. Please wait a moment.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const generalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 200,
    message: { error: 'Too many requests.' },
});

// ── Core Middleware ────────────────────────────────
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(generalLimiter);

// ── Health Check ───────────────────────────────────
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'GreenCart API v2026 is running 🌿' });
});

// ── Existing Routes ────────────────────────────────
app.use('/api/user',    userRouter);
app.use('/api/seller',  sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart',    cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order',   orderRouter);

// ── 2026 New Routes ────────────────────────────────
app.use('/api/chat',             chatLimiter, chatRouter);   // Gemini chatbot (rate-limited)
app.use('/api/search',           aiRouter);                  // /api/search/ai
app.use('/api/meal-planner',     aiRouter);                  // /api/meal-planner
app.use('/api/products',         aiRouter);                  // /api/products/:id/nutrition, /api/products/recommendations

// ── Global Error Handler ───────────────────────────
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(port, () => {
    console.log(`🌿 GreenCart API running on http://localhost:${port}`);
});