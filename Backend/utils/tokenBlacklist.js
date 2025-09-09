// utils/tokenBlacklist.js
// In-memory token blacklist (resets when the server restarts).
// Keeps constant-time checks and trims itself if it grows too large.

const tokenBlacklist = new Set();

// Optional: prevent unbounded growth (FIFO trim)
const MAX_SIZE = 5000;

function addToBlacklist(token) {
  if (!token) return;
  tokenBlacklist.add(token);

  // Trim oldest if we exceed MAX_SIZE
  if (tokenBlacklist.size > MAX_SIZE) {
    const oldest = tokenBlacklist.values().next().value;
    if (oldest) tokenBlacklist.delete(oldest);
  }
}

function isBlacklisted(token) {
  if (!token) return false;
  return tokenBlacklist.has(token);
}

module.exports = {
  addToBlacklist,
  isBlacklisted,
};
