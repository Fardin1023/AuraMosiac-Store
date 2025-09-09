const mongoose = require("mongoose");

const txSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["debit", "credit"], required: true },
    amount: { type: Number, required: true },
    description: { type: String, default: "" },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },

    // Optional payment metadata for better auditability
    method: { type: String, enum: ["COD", "ONLINE"], default: undefined },
    provider: { type: String, enum: ["COD", "BKASH", "NAGAD", "CARD", "OTHER"], default: undefined },
    status: { type: String, enum: ["PENDING", "PAID", "FAILED", "REFUNDED"], default: undefined },
    meta: { type: mongoose.Schema.Types.Mixed, default: undefined },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", txSchema);
