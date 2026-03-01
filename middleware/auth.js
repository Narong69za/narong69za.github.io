// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: auth.js
// VERSION: v3.0.0
// STATUS: production
// LAST FIX: switch to JWT cookie authentication
// =====================================================

const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {

  // DEV MODE
  if (req.query.dev === "true") {
    req.user = {
      id: 1,
      email: "dev@local",
      role: "dev"
    };
    return next();
  }

  let token = null;

  // 1. Try cookie
  if (req.cookies?.access_token) {
    token = req.cookies.access_token;
  }

  // 2. Try Authorization header
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split("Bearer ")[1];
  }

  if (!token) {
    return res.status(401).json({ error: "No token" });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = authMiddleware;
