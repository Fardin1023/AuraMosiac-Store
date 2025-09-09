const express = require("express");
const { User } = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.patch("/me", authMiddleware, async (req, res) => {
  try {
    const allowed = ["name", "phone", "city", "picture", "isProfileComplete"];
    const update = {};
    for (const k of allowed) if (k in req.body) update[k] = req.body[k];

    const user = await User.findByIdAndUpdate(req.user.id, update, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

module.exports = router;
