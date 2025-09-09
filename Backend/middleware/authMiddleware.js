const jwt = require("jsonwebtoken");
const { isBlacklisted } = require("../utils/tokenBlacklist");

const SECRET = process.env.JWT_SECRET || "dev_super_secret_change_me_please";

module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  if (isBlacklisted(token)) {
    return res.status(401).json({ message: "Token is invalid (logged out)" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid or expired" });
  }
};
