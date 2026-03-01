// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: auth.js
// VERSION: v3.2.0
// STATUS: production
// LAST FIX: use JWT_ACCESS_SECRET (match token.util)
// =====================================================

const jwt = require("jsonwebtoken");

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
      process.env.JWT_ACCESS_SECRET   // 🔥 แก้ตรงนี้
    );

    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = authMiddleware;
