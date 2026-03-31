/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: controllers/auth.controller.js
 * VERSION: v1.5.0 (FINAL MASTER - FRESH DATA FIX)
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

// ================= [1] REDIRECT TO GOOGLE =================
exports.googleRedirect = async (req, res) => {
  try {
    const state = crypto.randomBytes(32).toString("hex");
    res.cookie("oauth_state", state, { ...COOKIE_OPTIONS, maxAge: 10 * 60 * 1000 });
    return res.redirect(googleService.generateAuthUrl(state));
  } catch (err) {
    return res.redirect("https://sn-designstudio.dev/login.html?error=setup_failed");
  }
};

// ================= [2] GOOGLE CALLBACK (GENERATE USER) =================
exports.googleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    const storedState = req.cookies.oauth_state;

    if (!state || state !== storedState) return res.status(400).json({ error: "INVALID_OAUTH_STATE" });

    const googleUser = await googleService.getUserFromCode(code);
    let user = await db.getUserByEmail(googleUser.email);

    if (!user) {
      const newId = uuidv4();
      // สร้าง User ใหม่ลง DB อัตโนมัติ (Schema: google_id)
      await db.createUser({
        id: newId,
        google_id: googleUser.id,
        email: googleUser.email,
        role: "user",
        credits: 0
      });
      user = await db.getUserByEmail(googleUser.email);
    }

    const accessToken = tokenUtil.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.cookie("access_token", accessToken, { ...COOKIE_OPTIONS, maxAge: 60 * 60 * 1000 });
    res.clearCookie("oauth_state", COOKIE_OPTIONS);

    return res.redirect(`https://sn-designstudio.dev/create.html?token=${accessToken}`);
  } catch (err) {
    console.error("AUTH_ERROR:", err);
    return res.status(500).json({ error: "GOOGLE_LOGIN_FAILED" });
  }
};

// ================= [3] GET FRESH PROFILE (ดึงข้อมูลสดจาก DB) =================
// ฟังก์ชันนี้จะทำให้ชื่อและเครดิตเด้งโชว์ที่หน้าจอ
exports.getMe = async (req, res) => {
  try {
    // ดึงข้อมูลล่าสุดจาก Database โดยใช้ Email จาก Token
    const user = await db.getUserByEmail(req.user.email);

    if (!user) {
      return res.status(404).json({ ok: false, error: "USER_NOT_FOUND" });
    }

    // ส่งข้อมูลสดกลับไปที่หน้าบ้าน
    res.json({
      ok: true,
      user: {
        email: user.email,
        role: user.role,
        credits: user.credits // <--- แต้มจะเด้งจากตรงนี้
      }
    });
  } catch (err) {
    console.error("GET_ME_ERROR:", err);
    res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
};

