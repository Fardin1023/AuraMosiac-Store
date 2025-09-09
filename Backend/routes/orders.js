const express = require("express");
const auth = require("../middleware/authMiddleware");
const Order = require("../models/order");
const Transaction = require("../models/transaction");
const { Product } = require("../models/products");

const router = express.Router();

/**
 * Helper: sanitize payment payload from client to avoid storing sensitive data.
 * We only persist safe fields. Any unexpected fields are dropped.
 */
function sanitizePayment(input, total) {
  const safe = {
    method: "COD",
    provider: "COD",
    status: "PENDING",
    amount: Number(total) || 0,
    meta: {}
  };

  if (!input || typeof input !== "object") return safe;

  const method = String(input.method || "").toUpperCase();
  const provider = String(input.provider || "").toUpperCase();
  const status = String(input.status || "").toUpperCase();

  // Normalize method/provider
  if (method === "ONLINE") {
    safe.method = "ONLINE";
    if (["BKASH", "NAGAD", "CARD"].includes(provider)) {
      safe.provider = provider;
    } else {
      safe.provider = "OTHER";
    }
    // Only allow specific statuses
    safe.status = ["PAID", "PENDING", "FAILED", "REFUNDED"].includes(status)
      ? status
      : "PENDING";
  } else {
    // COD
    safe.method = "COD";
    safe.provider = "COD";
    safe.status = "PENDING";
  }

  // Amount is server-authoritative
  safe.amount = Number(total) || 0;

  // Whitelist meta per provider
  const metaIn = input.meta || {};
  if (safe.provider === "CARD") {
    // Only store non-sensitive fields
    const name = typeof metaIn.name === "string" ? metaIn.name : "";
    const last4 =
      typeof metaIn.last4 === "string" && metaIn.last4.length <= 4
        ? metaIn.last4
        : "";
    const expiry = typeof metaIn.expiry === "string" ? metaIn.expiry : "";
    safe.meta = { name, last4, expiry };
  } else if (safe.provider === "BKASH" || safe.provider === "NAGAD") {
    const phone =
      typeof metaIn.phone === "string" && /^01\d{9}$/.test(metaIn.phone)
        ? metaIn.phone
        : "";
    const txn = typeof metaIn.txn === "string" ? metaIn.txn : "";
    safe.meta = { phone, txn };
  } else {
    // OTHER / COD
    safe.meta = {};
  }

  return safe;
}

router.post("/", auth, async (req, res) => {
  try {
    const itemsIn = Array.isArray(req.body?.items) ? req.body.items : [];
    if (itemsIn.length === 0) return res.status(400).json({ message: "No items to order." });

    const ids = itemsIn.map(i => i.productId).filter(Boolean);
    const products = await Product.find({ _id: { $in: ids } }).lean();

    const items = itemsIn.map((i) => {
      const p = products.find((x) => String(x._id) === String(i.productId));
      const price = p ? Number(p.price || 0) : Number(i.price || 0);
      const name = p ? p.name : i.name;
      const image = p ? (Array.isArray(p.images) && p.images[0]) : i.image;
      const qty = Math.max(1, Number(i.qty || 1));
      return { productId: p ? p._id : i.productId, name, image, price, qty };
    });

    const total = items.reduce((s, it) => s + Number(it.price || 0) * Number(it.qty || 1), 0);

    // Sanitize and normalize payment info
    const payment = sanitizePayment(req.body?.payment, total);

    // Determine order status based on payment
    const status = payment.method === "ONLINE" && payment.status === "PAID" ? "paid" : "placed";

    const doc = {
      user: req.user.id,
      items,
      total,
      status,
      payment,
    };

    // optional shipping city if provided
    if (req.body?.city) {
      doc.city = String(req.body.city);
    }

    const order = await Order.create(doc);

    // decrement stock (best effort)
    await Promise.all(
      items.map(async (it) => {
        try {
          await Product.updateOne(
            { _id: it.productId, countInStock: { $gte: it.qty } },
            { $inc: { countInStock: -it.qty } }
          );
        } catch {}
      })
    );

    // Create a transaction only for PAID online payments (funds captured)
    if (payment.method === "ONLINE" && payment.status === "PAID") {
      await Transaction.create({
        user: req.user.id,
        type: "debit",
        amount: total,
        description: `Order ${order._id} via ${payment.provider}`,
        order: order._id,
        method: payment.method,
        provider: payment.provider,
        status: payment.status,
        meta: payment.meta || {},
      });
    }

    res.status(201).json(order);
  } catch (e) {
    console.error("[orders/create]", e);
    res.status(500).json({ message: "Failed to place order" });
  }
});

router.get("/my", auth, async (req, res) => {
  try {
    const list = await Order.find({ user: req.user.id }).sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (e) {
    console.error("[orders/my]", e);
    res.status(500).json({ message: "Failed to load orders" });
  }
});

module.exports = router;
