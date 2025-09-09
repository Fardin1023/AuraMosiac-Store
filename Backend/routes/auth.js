const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const mongoose = require("mongoose");                   // ✅
const { User } = require("../models/user");
const Transaction = require("../models/transaction");  // ✅
const authMiddleware = require("../middleware/authMiddleware");
const { addToBlacklist } = require("../utils/tokenBlacklist");

const router = express.Router();
const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

// env sanity logs
if (!process.env.JWT_SECRET) console.warn("[auth] WARNING: JWT_SECRET is not set.");
if (!process.env.GOOGLE_CLIENT_ID) console.warn("[auth] GOOGLE_CLIENT_ID is not set.");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      name, email, password: hashed,
      balance: 0,
      cityList: ["Dhaka", "Chittagong"],
      provider: "local",
      isProfileComplete: true,
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("[auth/register]", err);
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    if (!user.password) {
      return res.status(400).json({ message: "This account was created with Google. Please sign in with Google." });
    }

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = sign(user._id);
    res.json({
      token,
      user: {
        id: user._id, name: user.name, email: user.email,
        picture: user.picture,
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (err) {
    console.error("[auth/login]", err);
    res.status(500).json({ error: err.message });
  }
});

// Google Sign-In (unchanged for brevity)
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body || {};
    if (!credential) return res.status(400).json({ message: "Missing credential" });

    const allowedAudiences = [process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_ID_ALT].filter(Boolean);
    if (!allowedAudiences.length) {
      return res.status(500).json({
        message: "Server misconfiguration: GOOGLE_CLIENT_ID missing",
        hint: "Set GOOGLE_CLIENT_ID (and optionally GOOGLE_CLIENT_ID_ALT) on the server.",
      });
    }

    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({ idToken: credential, audience: allowedAudiences });
    const payload = ticket.getPayload();
    if (!payload) return res.status(401).json({ message: "Invalid Google token" });

    const { sub: googleId, email, name, picture } = payload || {};
    if (!email) return res.status(400).json({ message: "Google login failed: email missing" });

    let user = await User.findOne({ email });
    let isNewUser = false;
    if (!user) {
      user = await User.create({
        email, name, picture, googleId, provider: "google",
        balance: 0, cityList: ["Dhaka", "Chittagong"], isProfileComplete: false,
      });
      isNewUser = true;
    } else {
      const update = {};
      if (!user.googleId) update.googleId = googleId;
      if (!user.picture && picture) update.picture = picture;
      if (!user.provider || user.provider === "local") update.provider = "google";
      if (Object.keys(update).length) { user.set(update); await user.save(); }
    }

    const token = sign(user._id);
    return res.json({
      token, isNewUser,
      user: {
        id: user._id, name: user.name, email: user.email, picture: user.picture,
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (e) {
    console.error("[auth/google] error:", e.message);
    return res.status(401).json({
      message: "Google authentication failed",
      hint:
        "If this keeps happening, confirm the frontend uses the same Google Client ID as the server and that http://localhost:3000 is in Authorized JavaScript origins.",
    });
  }
});

// ME  → return user plus computed "spent" (sum(debits) - sum(credits))
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const rows = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: null,
          debit: { $sum: { $cond: [{ $eq: ["$type", "debit"] }, "$amount", 0] } },
          credit: { $sum: { $cond: [{ $eq: ["$type", "credit"] }, "$amount", 0] } },
        },
      },
    ]);

    const spent = (rows?.[0]?.debit || 0) - (rows?.[0]?.credit || 0);

    const payload = { ...user, spent };
    // keep backward compat for callers expecting res.data.user
    return res.json({ ...payload, user: payload });
  } catch (err) {
    console.error("[auth/me]", err);
    res.status(500).json({ error: err.message });
  }
});

// LOGOUT (blacklist)
router.post("/logout", authMiddleware, (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (token) addToBlacklist(token);
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
