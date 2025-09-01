// routes/ai.js
const express = require("express");
const { Product } = require("../models/products");
const { Category } = require("../models/category");
const router = express.Router();

// helper: format a short product line with clickable link
const fmt = (p) =>
  `🛍️ [${p.name}](/product/${p._id}) - ৳${p.price}${
    p.countInStock > 0 ? " (In stock)" : " (Out)"
  }`;

router.post("/chat", async (req, res) => {
  const { message } = req.body || {};
  if (!message || !String(message).trim()) {
    return res.json({ reply: "Please type something I can search for 🙂" });
  }

  try {
    const raw = String(message).trim();
    const lc = raw.toLowerCase();
    console.log("💬 User message:", raw);

    // Tokenize (for multi-word matching)
    const tokens = lc.split(/[^a-z0-9]+/).filter(Boolean);
    const tokenRegex = tokens.length ? new RegExp(tokens.join("|"), "i") : null;

    // 1) Try Category match
    const categories = await Category.find({}, "name").lean();
    const matchedCategory = categories.find((c) =>
      lc.includes(String(c.name).toLowerCase())
    );

    if (matchedCategory) {
      console.log("📂 Matched category:", matchedCategory.name);
      const products = await Product.find({ category: matchedCategory._id })
        .limit(8)
        .lean();
      if (products.length) {
        const reply =
          `Here are some products in **[${matchedCategory.name}](/category/${matchedCategory._id})**:\n` +
          products.map(fmt).join("\n");
        return res.json({ reply });
      } else {
        return res.json({
          reply: `I didn’t find any products in **[${matchedCategory.name}](/category/${matchedCategory._id})** right now.`,
        });
      }
    }

    // 2) Try Brand match
    const brandProducts = await Product.find({
      brand: { $regex: raw, $options: "i" },
    })
      .limit(8)
      .lean();

    if (brandProducts.length) {
      const brandName = brandProducts[0].brand || raw;
      console.log("🏷️ Matched brand:", brandName);
      const reply =
        `Here are some **[${brandName}](/brand/${encodeURIComponent(
          brandName
        )})** products:\n` + brandProducts.map(fmt).join("\n");
      return res.json({ reply });
    }

    // 3) Try Product name match
    let nameQuery = {};
    if (tokenRegex) nameQuery = { name: { $regex: tokenRegex } };
    const nameProducts = await Product.find(nameQuery).limit(8).lean();

    if (nameProducts.length) {
      console.log("📦 Matched by product name/tokens:", tokens.join(", "));
      const reply = `Here’s what I found:\n` + nameProducts.map(fmt).join("\n");
      return res.json({ reply });
    }

    // 4) Nothing matched → fallback with clickable categories & brands
    const someCats = categories.slice(0, 5);
    const someBrands = (await Product.distinct("brand", { brand: { $ne: "" } }))
      .filter(Boolean)
      .slice(0, 5);

    let reply = `😕 I couldn’t find anything for “${raw}”.\n`;

    if (someCats.length) {
      reply +=
        `Try categories like:\n` +
        someCats
          .map((c) => `- [${c.name}](/category/${c._id})`)
          .join("\n") +
        "\n";
    }

    if (someBrands.length) {
      reply +=
        `Or brands like:\n` +
        someBrands
          .map((b) => `- [${b}](/brand/${encodeURIComponent(b)})`)
          .join("\n");
    }

    return res.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err);
    return res.json({
      reply:
        "⚠️ Sorry, something went wrong while searching. Please try again in a moment.",
    });
  }
});

module.exports = router;
