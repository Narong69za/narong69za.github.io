/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: controllers/auth.controller.js
 * VERSION: v1.6.0 (ULTRA FIX - NO MORE MISMATCH)
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

// ================= [2] GOOGLE CALLBACK =================
exports.googleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    const storedState = req.cookies.oauth_state;

    if (!state || state !== storedState) return res.status(400).json({ error: "INVALID_OAUTH_STATE" });

    const googleUser = await googleService.getUserFromCode(code);
    
    // [FIX 1] ป้องกัน google_id เป็น undefined
    const gId = googleUser.id || googleUser.sub; 
    
    let user = await db.getUserByEmail(googleUser.email);

    if (!user) {
      const newId = uuidv4();

      
      // [FIX 2] ส่งค่าให้ DB มั่นใจว่า id เป็น String (UUID) และมี google_id
      await db.createUser({
    id: newId,
    google_id: googleUser.id || googleUser.sub, // [FIX] ดึงค่า ID ให้ชัวร์
    email: googleUser.email,
    role: "user",
    credits: 0
    });

      user = await db.getUserByEmail(googleUser.email);
    }

    // [FIX 3] MASTER BYPASS ROLE
    const finalRole = (user.email === 'narongsack.69@gmail.com') ? "admin" : user.role;

    const accessToken = tokenUtil.generateAccessToken({
      id: user.id,
      email: user.email,
      role: finalRole
    });

    // เซตคุกกี้ใบจริง
    res.cookie("access_token", accessToken, { ...COOKIE_OPTIONS, maxAge: 24 * 60 * 60 * 1000 }); // เพิ่มเป็น 24 ชม.
    res.clearCookie("oauth_state", COOKIE_OPTIONS);

    // [FIX 4] Redirect แบบสะอาด ไม่ต้องหิ้ว Token บน URL เพราะเราใช้ Cookie แล้ว
    return res.redirect(`https://sn-designstudio.dev/create.html`);
    
  } catch (err) {
    console.error("❌ AUTH_ERROR:", err);
    return res.status(500).json({ error: "GOOGLE_LOGIN_FAILED" });
  }
};

// ================= [3] GET FRESH PROFILE =================
exports.getMe = async (req, res) => {
  try {
    // req.user มาจาก middleware ที่ถอดรหัส Token
    const user = await db.getUserByEmail(req.user.email);

    if (!user) {
      return res.status(404).json({ ok: false, error: "USER_NOT_FOUND" });
    }

    res.json({
      ok: true,
      user: {
        email: user.email,
        role: user.role,
        credits: user.credits || 0
      }
    });
  } catch (err) {
    console.error("GET_ME_ERROR:", err);
    res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
};

