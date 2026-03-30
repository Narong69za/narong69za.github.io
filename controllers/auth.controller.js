// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: controllers/auth.controller.js
// VERSION: v
// STATUS: production-hardened
// LAST FIX: 2026-03-08
// - added redirect-safe login flow
// - preserved dashboard redirect
// - hardened cookie config
// =====================================================

const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const googleService = require("../services/google.service");
const tokenUtil = require("../utils/token.util");
const db = require("../db/db");

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  domain: ".sn-designstudio.dev",
  path: "/"
};

// ================= GOOGLE REDIRECT (แก้ไขแล้ว) =================
exports.googleRedirect = async (req, res) => {
  try {
    const state = crypto.randomBytes(32).toString("hex");

    // 1. เซ็ต Cookie ก่อน (ต้องทำก่อน Redirect)
    res.cookie("oauth_state", state, {
      ...COOKIE_OPTIONS,
      maxAge: 10 * 60 * 1000
    });

    // 2. สร้าง URL สำหรับไปหา Google
    const url = googleService.generateAuthUrl(state);

    // 3. ส่งคนไปหา Google (ห้ามส่งไปหน้าบ้านตรงนี้!)
    return res.redirect(url);
  } catch (err) {
    return res.redirect("https://sn-designstudio.dev/login.html?error=setup_failed");
  }
};

// ================= GOOGLE CALLBACK (แก้ไขแล้ว) =================
exports.googleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    const storedState = req.cookies.oauth_state;

    // เช็ค State
    if (!state || state !== storedState) {
      console.error("STATE_MISMATCH:", { state, storedState });
      return res.status(400).json({ error: "INVALID_OAUTH_STATE" });
    }

    const googleUser = await googleService.getUserFromCode(code);
    if (!googleUser?.email) return res.status(400).json({ error: "INVALID_GOOGLE_USER" });

    // ... (Logic เช็ค User/DB ของพี่เหมือนเดิม) ...

    const accessToken = tokenUtil.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // ล้าง Cookie State
    res.clearCookie("oauth_state", COOKIE_OPTIONS);

    // [SUCCESS] ส่งกลับหน้าบ้านพร้อม Token ที่ชื่อตัวแปรถูกต้อง!
    return res.redirect(`https://sn-designstudio.dev/create.html?token=${accessToken}`);

  } catch (err) {
    console.error("GOOGLE CALLBACK ERROR", err);
    return res.redirect("https://sn-designstudio.dev/login.html?error=callback_failed");
  }
};

