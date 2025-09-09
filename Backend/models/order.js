const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    image: String,
    price: Number,
    qty: Number,
  },
  { _id: false }
);

const paymentSchema = new mongoose.Schema(
  {
    method: { type: String, enum: ["COD", "ONLINE"], default: "COD" },
    provider: { type: String, enum: ["COD", "BKASH", "NAGAD", "CARD", "OTHER"], default: "COD" },
    status: { type: String, enum: ["PENDING", "PAID", "FAILED", "REFUNDED"], default: "PENDING" },
    amount: { type: Number, default: 0 },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} }, // e.g. { last4, expiry } or { phone, txn }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: [orderItemSchema],
    total: { type: Number, default: 0 },
    status: { type: String, default: "placed", enum: ["placed", "paid", "shipped", "delivered", "cancelled"] },
    payment: { type: paymentSchema, default: () => ({}) },
    // Optional shipping city (kept generic for your UI)
    city: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
