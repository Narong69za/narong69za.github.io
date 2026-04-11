/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: controllers/auth.controller.js
 * VERSION: v1.8.0 (TOTAL STABLE - COOKIE AUTH)
 * =====================================================
 */
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const googleService = require("../services/google.service");
const tokenUtil = require("../utils/token.util"); // [เรียกใช้] เพื่อสร้างบัตรผ่าน
const db = require("../db/db"); // [เรียกใช้] เพื่อคุยกับ Database

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  domain: ".sn-designstudio.dev",
  path: "/",
  partitioned: true 
};

// --- [1] ไปหา Google ---
exports.googleRedirect = async (req, res) => {
  try {
    const state = crypto.randomBytes(32).toString("hex");
    res.cookie("oauth_state", state, { ...COOKIE_OPTIONS, maxAge: 10 * 60 * 1000 });
    return res.redirect(googleService.generateAuthUrl(state));
  } catch (err) {
    return res.redirect("https://sn-designstudio.dev/login.html?error=setup_failed");
  }
};

// --- [2] Google ส่งกลับมา ---
exports.googleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const googleUser = await googleService.getUserFromCode(code);
    const gId = googleUser.id || googleUser.sub;

    // เช็ค User ใน DB (ใช้ db ที่ require มา)
    let user = await db.getUserByEmail(googleUser.email);
    if (!user) {
      await db.createUser({
        id: uuidv4(),
        google_id: gId,
        email: googleUser.email,
        role: "user",
        credits: 0
      });
      user = await db.getUserByEmail(googleUser.email);
    }

    // สร้าง Access Token (ใช้ tokenUtil ที่ require มา)
    const accessToken = tokenUtil.generateAccessToken({
      id: user.id,
      email: user.email,
      role: (user.email === 'narongsack.69@gmail.com' ? "admin" : user.role)
    });

    // ออกบัตรผ่านใส่คุกกี้
    res.cookie("access_token", accessToken, { ...COOKIE_OPTIONS, maxAge: 24 * 60 * 60 * 1000 });
    res.clearCookie("oauth_state", COOKIE_OPTIONS);

    return res.redirect(`https://sn-designstudio.dev/create.html`);
  } catch (err) {
    console.error("❌ AUTH_CALLBACK_ERROR:", err);
    return res.status(500).send("AUTH_FAILED");
  }
};

// --- [3] ดึงข้อมูล User (ใช้ในหน้า Create/Payment) ---
exports.getMe = async (req, res) => {
  try {
    const user = await db.getUserByEmail(req.user.email);
    if (!user) return res.status(404).json({ ok: false });
    
    res.json({
      ok: true,
      user: {
        email: user.email,
        role: user.role,
        credits: user.credits || 0
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
};

