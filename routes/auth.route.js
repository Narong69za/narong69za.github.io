/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: routes/auth.route.js
 * VERSION: v1.7.0 (INTERNAL AUTH - NO EXTERNAL MIDDLEWARE)
 * =====================================================
 */

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // ต้องใช้ตัวนี้เช็คบัตร
const authController = require("../controllers/auth.controller");

// ===============================
// [INTERNAL MIDDLEWARE] เช็คบัตรผ่านจากคุกกี้โดยตรง
// ===============================
const verifyInternal = (req, res, next) => {
  // อ่านบัตรจากคุกกี้ชื่อ access_token
  const token = req.cookies.access_token;

  if (!token) {
    console.log("❌ [AUTH]: No token in cookies");
    return res.status(401).json({ ok: false, error: "NO_TOKEN" });
  }

  try {
    // ใช้ Secret Key จาก .env
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET);
    req.user = decoded; // ยัดข้อมูล User ลง request เพื่อให้ getMe เอาไปใช้ต่อ
    next();
  } catch (err) {
    console.error("❌ [AUTH]: Token Invalid/Expired");
    return res.status(401).json({ ok: false, error: "INVALID_TOKEN" });
  }
};

// ===============================
// OAUTH ROUTES
// ===============================
router.get("/google", authController.googleRedirect);
router.get("/google/callback", authController.googleCallback);

// ===============================
// PROTECTED PROFILE (ใช้ Verify ภายในไฟล์นี้เลย)
// ===============================
router.get("/me", verifyInternal, authController.getMe);

// ===============================
// LOGOUT (ล้างคุกกี้ให้สะอาด)
// ===============================
const clearCookies = (res) => {
  const options = { domain: ".sn-designstudio.dev", path: "/" };
  res.clearCookie("access_token", options);
  res.clearCookie("refresh_token", options);
  res.clearCookie("oauth_state", options);
};

router.get("/logout", (req, res) => {
  clearCookies(res);
  return res.json({ status: "LOGGED_OUT" });
});

router.post("/logout", (req, res) => {
  clearCookies(res);
  return res.json({ status: "LOGGED_OUT" });
});

module.exports = router;

