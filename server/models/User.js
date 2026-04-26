import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // ── Existing fields (unchanged) ──
    name:      { type: String, required: true },
    email:     { type: String, required: true, unique: true },
    password:  { type: String, required: true },
    cartItems: { type: Object, default: {} },

    // ── 2026 Additions ──
    loyaltyPoints: { type: Number, default: 0 },
    preferences: {
        dietary:       [String],       // ["vegan", "gluten-free"]
        notifications: { type: Boolean, default: true },
        theme:         { type: String, enum: ['light', 'dark'], default: 'light' },
    },
    browsedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
}, { minimize: false })

const User = mongoose.models.user || mongoose.model('user', userSchema)

export default User