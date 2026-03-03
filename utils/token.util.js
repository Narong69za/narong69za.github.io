// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: utils/token.util.js
// VERSION: v9.0.0
// STATUS: production-final
// LAYER: security-core
// RESPONSIBILITY:
// - generate JWT access token
// - generate JWT refresh token
// - verify access token
// - prevent missing secret crash
// DEPENDS ON:
// - jsonwebtoken
// - process.env.JWT_ACCESS_SECRET
// - process.env.JWT_REFRESH_SECRET
// LAST FIX:
// - hardened secret validation
// - added verifyAccessToken
// - upgraded to v9 header standard
// =====================================================

const jwt = require("jsonwebtoken");

// =====================================================
// SECRET VALIDATION
// =====================================================

if (!process.env.JWT_ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET MISSING");
}

if (!process.env.JWT_REFRESH_SECRET) {
  throw new Error("JWT_REFRESH_SECRET MISSING");
}

// =====================================================
// GENERATE ACCESS TOKEN
// =====================================================

exports.generateAccessToken = (payload) => {

  return jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "1h",
      issuer: "sn-design-studio",
      algorithm: "HS256"
    }
  );

};

// =====================================================
// GENERATE REFRESH TOKEN
// =====================================================

exports.generateRefreshToken = (payload) => {

  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
      issuer: "sn-design-studio",
      algorithm: "HS256"
    }
  );

};

// =====================================================
// VERIFY ACCESS TOKEN
// =====================================================

exports.verifyAccessToken = (token) => {

  try {

    return jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET,
      {
        issuer: "sn-design-studio",
        algorithms: ["HS256"]
      }
    );

  } catch (err) {
    return null;
  }

};

// =====================================================
// VERIFY REFRESH TOKEN
// =====================================================

exports.verifyRefreshToken = (token) => {

  try {

    return jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET,
      {
        issuer: "sn-design-studio",
        algorithms: ["HS256"]
      }
    );

  } catch (err) {
    return null;
  }

};
