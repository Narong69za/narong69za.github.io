/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: routes/auth.route.js
 * VERSION: v1.6.0 (FINAL FIX - DATABASE CONNECTED)
 * =====================================================
 */

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
// PROTECTED USER PROFILE (แก้ไขจุดนี้!)
// ===============================
// เปลี่ยนจากฟังก์ชันเดิม มาใช้ getMe จาก Controller เพื่อดึงเครดิตจาก DB
router.get("/me", authMiddleware, authController.getMe);

// ===============================
// LOGOUT
// ===============================
router.get("/logout", (req, res) => {
  res.clearCookie("access_token", { domain: ".sn-designstudio.dev", path: "/" });
  res.clearCookie("refresh_token", { domain: ".sn-designstudio.dev", path: "/" });
  return res.json({ status: "LOGGED_OUT" });
});

router.post("/logout", (req, res) => {
  res.clearCookie("access_token", { domain: ".sn-designstudio.dev", path: "/" });
  res.clearCookie("refresh_token", { domain: ".sn-designstudio.dev", path: "/" });
  return res.json({ status: "LOGGED_OUT" });
});

module.exports = router;

