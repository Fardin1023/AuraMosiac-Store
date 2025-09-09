// routes/ai.js
const express = require("express");
const router = express.Router();
const { Product } = require("../models/products");
const { Category } = require("../models/category");

/* Helpers */
const firstImage = (p) =>
  (Array.isArray(p.images) && p.images[0]) ||
  p.image ||
  "https://via.placeholder.com/400x300?text=Product";

const asCard = (p, badge = "") => ({
  _id: p._id,
  name: p.name,
  price: p.price,
  images: [firstImage(p)],
  badge,
});

const parseBudget = (text) => {
  // finds "under 500", "below 1000", "≤ 700", "under tk 1200" etc.
  const m = /(?:under|below|<=|≤|less than)\s*(?:tk|৳)?\s*(\d+)/i.exec(text);
  if (m) return { max: Number(m[1]) || undefined };
  const only = /(?:tk|৳)\s*(\d+)/i.exec(text);
  if (only) return { max: Number(only[1]) || undefined };
  return {};
};

const dealsBlock = async (maxPrice, title = `Deals under Tk ${maxPrice}`) => {
  const items = await Product.find({
    price: { $lte: maxPrice },
    countInStock: { $gt: 0 },
  })
    .sort({ rating: -1 })
    .limit(8)
    .lean();

  if (!items.length) return null;
  return { type: "products", title, items: items.map((p) => asCard(p, "Deal")) };
};

const featuredBlock = async () => {
  const items = await Product.find({ isFeatured: true })
    .sort({ rating: -1 })
    .limit(8)
    .lean();
  if (!items.length) return null;
  return { type: "products", title: "Featured & Trending", items: items.map((p) => asCard(p, "Featured")) };
};

const categoryBlock = async (cat) => {
  const items = await Product.find({ category: cat._id })
    .sort({ rating: -1 })
    .limit(8)
    .lean();
  if (!items.length) return null;
  return { type: "products", title: `${cat.name}`, items: items.map((p) => asCard(p)) };
};

const brandBlock = async (brand) => {
  const items = await Product.find({ brand: { $regex: `^\\s*${brand}\\s*$`, $options: "i" } })
    .sort({ rating: -1 })
    .limit(8)
    .lean();
  if (!items.length) return null;
  return { type: "products", title: `${brand}`, items: items.map((p) => asCard(p)) };
};

const suggestionChips = (extra = []) => ({
  type: "chips",
  items: [
    "Show deals under Tk 500",
    "Trending Skincare",
    "Best rated this week",
    "Handcraft gifts",
    "Plants for home",
    ...extra,
  ],
});

/* ==============  INTENTFUL CHAT  ============== */
router.post("/chat", async (req, res) => {
  const { message, taste } = req.body || {};
  const raw = String(message || "").trim();
  if (!raw) {
    return res.json({
      blocks: [
        { type: "text", text: "Please type something I can search for 🙂" },
        suggestionChips().type ? suggestionChips() : null,
      ].filter(Boolean),
    });
  }

  const lc = raw.toLowerCase();
  const blocks = [];
  try {
    // 1) Budget
    const budget = parseBudget(lc);
    if (budget.max) {
      blocks.push({ type: "text", text: `Here are some good picks **under Tk ${budget.max}**:` });
      const deals = await dealsBlock(budget.max);
      if (deals) blocks.push(deals);
      blocks.push(suggestionChips());
      return res.json({ blocks });
    }

    // 2) Category (Skincare, Handcraft, Plants, etc.)
    const cats = await Category.find({}, "name").lean();
    const foundCat =
      cats.find((c) => lc.includes(String(c.name || "").toLowerCase())) ||
      null;

    if (foundCat) {
      blocks.push({ type: "text", text: `Great! Here are **${foundCat.name}** suggestions:` });
      const cb = await categoryBlock(foundCat);
      if (cb) blocks.push(cb);
      blocks.push(suggestionChips());
      return res.json({ blocks });
    }

    // 3) Brand
    const brandHint = /brand\s+([a-z0-9 \-]+)/i.exec(raw);
    const brandInline = brandHint ? brandHint[1].trim() : null;
    if (brandInline) {
      blocks.push({ type: "text", text: `Here are some **${brandInline}** products:` });
      const bb = await brandBlock(brandInline);
      if (bb) blocks.push(bb);
      blocks.push(suggestionChips());
      return res.json({ blocks });
    }

    // 4) Requests for featured / best rated / trending
    if (/(feature|best|top|trending|popular|offer|deal)/i.test(lc)) {
      const feat = await featuredBlock();
      if (feat) {
        blocks.push({ type: "text", text: "Here are some **featured / trending** picks:" });
        blocks.push(feat);
        blocks.push(suggestionChips());
        return res.json({ blocks });
      }
    }

    // 5) Product-name fuzzy tokens
    const tokens = lc.split(/[^a-z0-9]+/).filter(Boolean);
    const tokenRegex = tokens.length ? new RegExp(tokens.join("|"), "i") : null;
    let items = [];
    if (tokenRegex) {
      items = await Product.find({ name: { $regex: tokenRegex } })
        .sort({ rating: -1 })
        .limit(8)
        .lean();
    }
    if (items.length) {
      blocks.push({ type: "text", text: "Here’s what I found:" });
      blocks.push({ type: "products", title: "Matches", items: items.map((p) => asCard(p)) });
      blocks.push(suggestionChips());
      return res.json({ blocks });
    }

    // 6) Fallback — featured + chips
    const feat = await featuredBlock();
    blocks.push({
      type: "text",
      text:
        `I couldn’t find an exact match for “${raw}”. Try these suggestions or pick a category/brand:`,
    });
    if (feat) blocks.push(feat);
    blocks.push({
      type: "chips",
      items: [
        "Skincare",
        "Handcraft gifts",
        "Deals under Tk 500",
        "Best rated this week",
        "Plants for home",
      ],
    });

    return res.json({ blocks });
  } catch (err) {
    console.error("[ai/chat] error:", err);
    return res.json({
      blocks: [{ type: "text", text: "⚠️ Sorry, something went wrong." }, suggestionChips()],
    });
  }
});

/* ==============  STRUCTURED RECOMMEND  ============== */
router.post("/recommend", async (req, res) => {
  const taste = req.body?.taste || {};
  const categories = Array.isArray(taste.categories) ? taste.categories : [];
  const brands = Array.isArray(taste.brands) ? taste.brands : [];
  const minRating = Number(taste.minRating || 0);
  const maxBudget = Number(taste.budget?.max || 0);

  const blocks = [];
  try {
    // Group 1: top by category taste
    if (categories.length) {
      const cats = await Category.find({
        name: { $in: categories.map((c) => new RegExp(`^\\s*${c}\\s*$`, "i")) },
      }).lean();

      for (const cat of cats) {
        const items = await Product.find({
          category: cat._id,
          ...(minRating ? { rating: { $gte: minRating } } : {}),
          ...(maxBudget ? { price: { $lte: maxBudget } } : {}),
          countInStock: { $gt: 0 },
        })
          .sort({ rating: -1, price: 1 })
          .limit(8)
          .lean();
        if (items.length) {
          blocks.push({
            type: "products",
            title: `${cat.name} — Top Picks`,
            items: items.map((p) => asCard(p, maxBudget && p.price <= maxBudget ? "Deal" : "")),
          });
        }
      }
    }

    // Group 2: Brands
    if (brands.length) {
      for (const b of brands) {
        const items = await Product.find({
          brand: { $regex: `^\\s*${b}\\s*$`, $options: "i" },
          ...(minRating ? { rating: { $gte: minRating } } : {}),
          ...(maxBudget ? { price: { $lte: maxBudget } } : {}),
          countInStock: { $gt: 0 },
        })
          .sort({ rating: -1, price: 1 })
          .limit(8)
          .lean();
        if (items.length) {
          blocks.push({
            type: "products",
            title: `${b} — Best For You`,
            items: items.map((p) => asCard(p, maxBudget && p.price <= maxBudget ? "Deal" : "")),
          });
        }
      }
    }

    // Group 3: Generic Featured / Deals
    if (maxBudget) {
      const deals = await dealsBlock(maxBudget);
      if (deals) blocks.push(deals);
    } else {
      const feat = await featuredBlock();
      if (feat) blocks.push(feat);
    }

    if (!blocks.length) {
      blocks.push({
        type: "text",
        text:
          "I couldn’t find personalized picks yet. Try setting a **budget**, **category** (e.g., Skincare), or **min rating**.",
      });
    }
    blocks.push({
      type: "chips",
      items: [
        "Deals under Tk 500",
        "Trending Skincare",
        "Plants for home",
        "Handcraft gifts",
        "Best rated this week",
      ],
    });

    return res.json({ blocks });
  } catch (err) {
    console.error("[ai/recommend] error:", err);
    return res.json({
      blocks: [{ type: "text", text: "⚠️ Sorry, I couldn’t fetch recommendations." }],
    });
  }
});

/* ==============  GIFT BUILDER  ============== */
/**
 * POST /api/ai/gift
 * body: { gender: "male"|"female", relation: "relative"|"friend", bundleSize: "single"|"pair"|"multi", budgetMax?: number }
 */
router.post("/gift", async (req, res) => {
  try {
    const gender = String(req.body?.gender || "").toLowerCase();        // male/female
    const relation = String(req.body?.relation || "").toLowerCase();    // relative/friend
    const bundleSize = String(req.body?.bundleSize || "pair").toLowerCase(); // single/pair/multi
    const budgetMax = Number(req.body?.budgetMax || 0);

    // Preferred categories by simple heuristic
    const prefByGender = gender === "female"
      ? ["Skincare", "Handcraft", "Gifting", "Plants"]
      : ["Handcraft", "Plants", "Gifting", "Skincare"];

    const prefByRelation = relation === "relative"
      ? ["Gifting", "Handcraft", "Skincare", "Plants"]
      : ["Skincare", "Plants", "Handcraft", "Gifting"];

    // Merge preferences preserving order & uniqueness
    const wantedCategoryNames = Array.from(new Set([...prefByGender, ...prefByRelation]));

    // Resolve categories from DB (case-insensitive exact name)
    const catDocs = await Category.find({
      name: { $in: wantedCategoryNames.map((n) => new RegExp(`^\\s*${n}\\s*$`, "i")) },
    }).lean();

    const catIds = catDocs.map((c) => c._id);

    // Build a pool of candidate products
    const pool = await Product.find({
      ...(catIds.length ? { category: { $in: catIds } } : {}),
      ...(budgetMax ? { price: { $lte: budgetMax } } : {}),
      countInStock: { $gt: 0 },
    })
      .sort({ rating: -1, price: 1 })
      .limit(60)
      .lean();

    // if pool too small, broaden without category
    let candidates = pool;
    if (candidates.length < 4) {
      const fallback = await Product.find({
        ...(budgetMax ? { price: { $lte: budgetMax } } : {}),
        countInStock: { $gt: 0 },
      })
        .sort({ rating: -1, price: 1 })
        .limit(60)
        .lean();
      candidates = fallback;
    }

    // Decide the number of items
    const count = bundleSize === "single" ? 1 : bundleSize === "pair" ? 2 : 3;
    const items = candidates.slice(0, Math.max(1, count)).map((p, idx) =>
      asCard(p, idx === 0 ? "Hero pick" : "Nice match")
    );

    const total = items.reduce((sum, p) => sum + Number(p.price || 0), 0);
    const title = `Your ${count === 1 ? "Single" : count === 2 ? "Pair" : "Bundle"} Gift`;
    const message =
      relation === "friend"
        ? "We picked feel-good items your friend will love."
        : "Thoughtful picks that family will appreciate.";

    return res.json({ title, items, total, message });
  } catch (err) {
    console.error("[ai/gift] error:", err);
    return res.status(500).json({ title: "Error building gift", items: [], total: 0 });
  }
});

module.exports = router;
