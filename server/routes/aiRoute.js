import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import NodeCache from 'node-cache';
import Product from '../models/Product.js';

const router = express.Router();
const cache = new NodeCache({ stdTTL: 300 });

const getModel = () => {
    if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
};

// ── POST /api/search/ai ────────────────────────────
// Natural language search → extract filters → MongoDB query
router.post('/ai', async (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query required' });

    const cacheKey = `search_${query.toLowerCase().trim()}`;
    if (cache.has(cacheKey)) {
        const { filters } = cache.get(cacheKey);
        return res.json({ filters });
    }

    try {
        const model = getModel();
        const prompt = `
You are a grocery search assistant. Extract search intent from: "${query}"
Return ONLY valid JSON (no markdown) in this format:
{
  "categories": [],
  "tags": [],
  "maxPrice": null,
  "minPrice": null,
  "keywords": []
}
Categories available: Vegetables, Fruits, Dairy, Drinks, Instant, Bakery, Grains
Tags available: organic, vegan, gluten-free, diabetic-friendly, high-protein, low-calorie
        `.trim();

        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json|```/g, '').trim();
        const filters = JSON.parse(text);

        cache.set(cacheKey, { filters });

        // Build MongoDB query
        const mongoQuery = { inStock: true };
        if (filters.categories?.length > 0) mongoQuery.category = { $in: filters.categories };
        if (filters.tags?.length > 0) mongoQuery.tags = { $all: filters.tags };
        if (filters.maxPrice) mongoQuery.offerPrice = { $lte: filters.maxPrice };
        if (filters.minPrice) mongoQuery['$or'] = [{ offerPrice: { $gte: filters.minPrice } }];

        const products = await Product.find(mongoQuery).limit(24);
        res.json({ filters, products, count: products.length });
    } catch (error) {
        console.error('AI search error:', error.message);
        // Fallback to text search
        const products = await Product.find({
            inStock: true,
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
            ]
        }).limit(24);
        res.json({ filters: {}, products, count: products.length });
    }
});

// ── GET /api/products/recommendations ─────────────
router.get('/recommendations', async (req, res) => {
    const { cartItems } = req.query; // comma-separated product IDs
    if (!cartItems) {
        const products = await Product.find({ inStock: true }).limit(6);
        return res.json({ products });
    }

    const cacheKey = `recs_${cartItems}`;
    if (cache.has(cacheKey)) return res.json({ products: cache.get(cacheKey) });

    try {
        const ids = cartItems.split(',');
        const cartProducts = await Product.find({ _id: { $in: ids } });
        const names = cartProducts.map(p => p.name).join(', ');

        const model = getModel();
        const prompt = `
User has these grocery items in cart: ${names}
Suggest 6 complementary Indian grocery product names they might also need.
Return ONLY a JSON array of strings (product names), no markdown.
Example: ["Tomato", "Onion", "Garlic", "Ginger", "Green Chilli", "Coriander"]
        `.trim();

        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json|```/g, '').trim();
        const suggestedNames = JSON.parse(text);

        // Match against DB
        const recommended = await Product.find({
            inStock: true,
            _id: { $nin: ids },
            $or: suggestedNames.map(name => ({ name: { $regex: name, $options: 'i' } }))
        }).limit(6);

        cache.set(cacheKey, recommended);
        res.json({ products: recommended });
    } catch (error) {
        console.error('Recommendations error:', error.message);
        const products = await Product.find({ inStock: true }).limit(6);
        res.json({ products });
    }
});

// ── POST /api/meal-planner ─────────────────────────
router.post('/meal-planner', async (req, res) => {
    const { diet, days, people } = req.body;
    const cacheKey = `meal_${diet}_${days}_${people}`;
    if (cache.has(cacheKey)) return res.json({ mealPlan: cache.get(cacheKey) });

    try {
        const model = getModel();
        const prompt = `
Create a ${days}-day ${diet} Indian meal plan for ${people} people.
Return ONLY valid JSON array (no markdown):
[
  {
    "day": 1,
    "meals": {
      "Breakfast": { "name": "...", "items": ["item1", "item2"] },
      "Lunch":     { "name": "...", "items": ["item1", "item2"] },
      "Snack":     { "name": "...", "items": ["item1"] },
      "Dinner":    { "name": "...", "items": ["item1", "item2"] }
    }
  }
]
Use common Indian grocery items like rice, dal, roti, paneer, vegetables, fruits.
        `.trim();

        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json|```/g, '').trim();
        const mealPlan = JSON.parse(text);
        cache.set(cacheKey, mealPlan);
        res.json({ mealPlan });
    } catch (error) {
        console.error('Meal planner error:', error.message);
        res.status(500).json({ error: 'Could not generate meal plan. Please try again.' });
    }
});

// ── POST /api/products/:id/nutrition ──────────────
router.post('/:id/nutrition', async (req, res) => {
    const { productName, category } = req.body;
    const cacheKey = `nutrition_${productName?.toLowerCase()}`;
    if (cache.has(cacheKey)) return res.json({ nutrition: cache.get(cacheKey) });

    try {
        const model = getModel();
        const prompt = `
Provide nutritional information per 100g for: "${productName}" (category: ${category})
Return ONLY valid JSON (no markdown):
{
  "calories": 85,
  "protein": 2.5,
  "carbs": 18,
  "fat": 0.5,
  "fiber": 3,
  "tags": ["High Fiber", "Low Fat", "Natural"]
}
Tags should be 2-4 relevant health tags from: High Fiber, Low Fat, High Protein, Low Sugar, Natural, Diabetic Friendly, Vitamin Rich, Antioxidant Rich, Low Calorie, High Calcium
        `.trim();

        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json|```/g, '').trim();
        const nutrition = JSON.parse(text);

        // Also update product in DB if it doesn't have nutrition
        if (req.params.id && req.params.id.length === 24) {
            await Product.findByIdAndUpdate(req.params.id, { nutrition }, { new: false }).catch(() => {});
        }

        cache.set(cacheKey, nutrition);
        res.json({ nutrition });
    } catch (error) {
        console.error('Nutrition analysis error:', error.message);
        res.status(500).json({ error: 'Could not analyze nutritional value.' });
    }
});

export default router;
