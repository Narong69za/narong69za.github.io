// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: routes/auth.route.js
// VERSION: v9.2.0
// STATUS: production-final
// LAYER: auth
// RESPONSIBILITY:
// - google oauth
// - jwt protected profile
// - logout
// DEPENDS ON:
// - middleware/auth.js
// - controllers/auth.controller.js
// LAST FIX:
// - removed jwt.middleware
// - unified to v9 auth system
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

router.get("/me", authMiddleware, authController.me);

// ===============================
// LOGOUT
// ===============================

router.get("/logout", authController.logout);
router.post("/logout", authController.logout);

module.exports = router;
