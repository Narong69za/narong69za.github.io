// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: middleware/auth.js
// VERSION: v9.2.0
// STATUS: production-final
// LAYER: security
// RESPONSIBILITY:
// - verify JWT access token
// - attach req.user
// - support cookie + bearer
// DEPENDS ON:
// - utils/token.util.js
// LAST FIX:
// - removed direct jwt usage
// - fully centralized verification
// =====================================================

const tokenUtil = require("../utils/token.util");

function extractToken(req) {

  // 1️⃣ Cookie
  if (req.cookies?.access_token) {
    return req.cookies.access_token;
  }

  // 2️⃣ Bearer
  if (req.headers.authorization?.startsWith("Bearer ")) {
    return req.headers.authorization.split("Bearer ")[1];
  }

  return null;
}

function authMiddleware(req, res, next) {

  // DEV BYPASS (controlled)
  if (process.env.DEV_MODE === "true") {
    req.user = {
      id: "dev-user",
      role: "dev"
    };
    return next();
  }

  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ error: "NO_TOKEN" });
  }

  const decoded = tokenUtil.verifyAccessToken(token);

  if (!decoded) {
    return res.status(401).json({ error: "INVALID_TOKEN" });
  }

  req.user = decoded;

  next();
}

module.exports = authMiddleware;
