import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    // ── Existing fields (unchanged) ──
    name:        { type: String, required: true },
    description: { type: Array, required: true },
    price:       { type: Number, required: true },
    offerPrice:  { type: Number, required: true },
    image:       { type: Array, required: true },
    category:    { type: String, required: true },
    inStock:     { type: Boolean, default: true },

    // ── 2026 Additions ──
    freshness: {
        harvestDate: Date,
        expiryDate:  Date,
    },
    tags:      [String],     // ["organic", "vegan", "gluten-free", "diabetic-friendly", "high-protein", "low-calorie"]
    nutrition: {
        calories: Number,
        protein:  Number,
        carbs:    Number,
        fat:      Number,
        fiber:    Number,
    },
    badge:     String,       // "Best Seller" | "New" | "Sale" | "Organic"
    viewCount: { type: Number, default: 0 },
}, { timestamps: true })

const Product = mongoose.models.product || mongoose.model('product', productSchema)

export default Product