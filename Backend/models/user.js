const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Core
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String }, // ← optional for Google users

    // OAuth
    googleId: { type: String, index: true },
    provider: { type: String, enum: ["local", "google"], default: "local" },

    // Profile
    picture: String,
    phone: String,
    city: String,
    isProfileComplete: { type: Boolean, default: false },

    // Existing fields
    balance: { type: Number, default: 0 },
    cityList: { type: [String], default: [] },
  },
  { timestamps: true }
);

exports.User = mongoose.model("User", userSchema);
