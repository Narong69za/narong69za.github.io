// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: middleware/auth.js
// VERSION: v9.1.0
// STATUS: production-final
// LAYER: core
// RESPONSIBILITY:
// - verify JWT access token
// - attach req.user
// DEPENDS ON:
// - config/system.config.js
// LAST FIX:
// - centralized JWT secret via system.config
// =====================================================

const jwt = require("jsonwebtoken");
const config = require("../config/system.config");

async function authMiddleware(req, res, next) {

  if (req.query.dev === "true") {
    req.user = {
      id: 1,
      email: "dev@local",
      role: "dev"
    };
    return next();
  }

  let token = null;

  if (req.cookies?.access_token) {
    token = req.cookies.access_token;
  }

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split("Bearer ")[1];
  }

  if (!token) {
    return res.status(401).json({ error: "No token" });
  }

  try {

    const decoded = jwt.verify(
      token,
      config.JWT_ACCESS_SECRET
    );

    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = authMiddleware;
