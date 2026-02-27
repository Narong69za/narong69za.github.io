/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: token.util.js
 * VERSION: v1.0.0
 * STATUS: production
 * LAST FIX: JWT Access + Refresh
 */

const jwt = require("jsonwebtoken");

exports.generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "1h"
  });
};

exports.generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d"
  });
};
