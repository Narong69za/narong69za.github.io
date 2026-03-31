/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: controllers/auth.controller.js
 * VERSION: v1.3.0 (COMPLETE FIX)
 * =====================================================
 */
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

// ================= GOOGLE REDIRECT =================
exports.googleRedirect = async (req, res) => {
  try {
    const state = crypto.randomBytes(32).toString("hex");

    // [1] เซ็ต Cookie บัตรคิว
    res.cookie("oauth_state", state, {
      ...COOKIE_OPTIONS,
      maxAge: 10 * 60 * 1000
    });

    const url = googleService.generateAuthUrl(state);
    return res.redirect(url);
  } catch (err) {
    console.error("REDIRECT_ERROR:", err);
    return res.redirect("https://sn-designstudio.dev/login.html?error=setup_failed");
  }
};

// ================= GOOGLE CALLBACK =================
exports.googleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    const storedState = req.cookies.oauth_state;

    // [2] ตรวจสอบบัตรคิว
    if (!state || state !== storedState) {
      console.error("STATE_MISMATCH:", { state, storedState });
      return res.status(400).json({ error: "INVALID_OAUTH_STATE" });
    }

    // [3] แลกของจาก Google
    const googleUser = await googleService.getUserFromCode(code);
    if (!googleUser?.email) return res.status(400).json({ error: "INVALID_GOOGLE_USER" });

    // [4] เช็คหรือสร้าง User ใน DB
    let user = await db.getUserByEmail(googleUser.email);
    if (!user) {
      const newId = uuidv4();
      await db.createUser({
        id: newId,
        googleId: googleUser.id,
        email: googleUser.email,
        role: "user" // ค่าเริ่มต้นสำหรับ User ใหม่
      });
      user = await db.getUserByEmail(googleUser.email);
    }

    // [5] สร้าง Token ให้ User
    const accessToken = tokenUtil.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // ล้างบัตรคิวเก่า
    res.clearCookie("oauth_state", COOKIE_OPTIONS);

    // [6] ส่งกลับหน้าบ้านพร้อม Token (ตัวแปรต้องชื่อ accessToken)
    return res.redirect(`https://sn-designstudio.dev/create.html?token=${accessToken}`);

  } catch (err) {
    console.error("GOOGLE CALLBACK ERROR", err);
    return res.redirect("https://sn-designstudio.dev/login.html?error=callback_failed");
  }
};
