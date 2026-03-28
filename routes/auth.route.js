// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: routes/auth.route.js
// VERSION: v
// STATUS: production-fixed
// LAYER: auth
// RESPONSIBILITY:
// - google oauth
// - jwt protected profile
// - logout
// DEPENDS ON:
// - middleware/auth.js
// - controllers/auth.controller.js
// LAST FIX: 2026-03-08
// - fixed undefined controller crash
// - protected routes fallback
// =====================================================

const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth");

// ===============================
// OAUTH ENTRY
// ===============================

router.get("/google", authController.googleRedirect);

// ===============================
// OAUTH CALLBACK
// ===============================

router.get("/google/callback", authController.googleCallback);

// ===============================
// PROTECTED USER PROFILE
// ===============================

router.get("/me", authMiddleware, (req, res) => {
  return res.json({
    id: req.user?.id,
    email: req.user?.email,
    role: req.user?.role
  });
});

// ===============================
// LOGOUT
// ===============================

router.get("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  return res.json({ status: "LOGGED_OUT" });
});

router.post("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  return res.json({ status: "LOGGED_OUT" });
});

module.exports = router;
