/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: jwt.middleware.js
 * VERSION: v1.0.0
 * STATUS: production
 * LAST FIX: verify access_token cookie
 */

const jwt = require("jsonwebtoken");

exports.verifyAccessToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ error: "No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
