const express = require("express");
const auth = require("../middleware/authMiddleware");
const Transaction = require("../models/transaction");

const router = express.Router();

// GET /api/transactions/my
router.get("/my", auth, async (req, res) => {
  try {
    const list = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (e) {
    console.error("[transactions/my]", e);
    res.status(500).json({ message: "Failed to load transactions" });
  }
});

module.exports = router;
