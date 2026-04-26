import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // ── Existing fields (unchanged) ──
    userId:      { type: String, required: true, ref: "user" },
    items: [
      {
        product:  { type: String, required: true, ref: "product" },
        quantity: { type: Number, required: true },
      },
    ],
    amount:      { type: Number, required: true },
    address:     { type: String, required: true, ref: "address" },
    status:      { type: String, default: "Order Placed" },
    paymentType: { type: String, required: true },
    isPaid:      { type: Boolean, required: true, default: false },

    // ── 2026 Additions ──
    trackingStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'],
      default: 'placed',
    },
    trackingTimeline: [{
      status:    String,
      timestamp: Date,
      note:      String,
    }],
    pointsEarned: Number,
  },
  { timestamps: true }
);

const Order = mongoose.models.order || mongoose.model("order", orderSchema);

export default Order;
