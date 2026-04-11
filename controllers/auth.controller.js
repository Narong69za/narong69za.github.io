/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: controllers/auth.controller.js
 * VERSION: v1.7.0 (THE END OF BUGS - PRODUCTION)
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
  domain: ".sn-designstudio.dev", // จุดนำหน้าคือหัวใจของการแชร์ข้าม Subdomain
  path: "/",
  partitioned: true // [FIX] สำหรับบราวเซอร์รุ่นใหม่ๆ (Kiwi/Chrome) ป้องกันคุกกี้หาย
};

// ================= [1] REDIRECT TO GOOGLE =================
exports.googleRedirect = async (req, res) => {
  try {
    const state = crypto.randomBytes(32).toString("hex");
    // เซต State สำหรับตรวจสอบตอนขากลับ
    res.cookie("oauth_state", state, { ...COOKIE_OPTIONS, maxAge: 10 * 60 * 1000 });
    return res.redirect(googleService.generateAuthUrl(state));
  } catch (err) {
    console.error("❌ REDIRECT_ERROR:", err);
    return res.redirect("https://sn-designstudio.dev/login.html?error=setup_failed");
  }
};

// ================= [2] GOOGLE CALLBACK =================
exports.googleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    const storedState = req.cookies.oauth_state;

    // [ตรวจสอบรหัสลับ] ป้องกันการปลอมแปลง
    if (!state || state !== storedState) {
      console.warn("⚠️ INVALID_STATE: Possible CSRF or Cookie Mismatch");
      return res.status(400).json({ error: "INVALID_OAUTH_STATE" });
    }

    const googleUser = await googleService.getUserFromCode(code);
    if (!googleUser || !googleUser.email) throw new Error("GOOGLE_DATA_MISSING");

    // [จุดที่พาร์ทเนอร์เคยติด] ดักทั้ง id และ sub ให้ชัวร์ 100%
    const gId = googleUser.id || googleUser.sub;

    let user = await db.getUserByEmail(googleUser.email);

    if (!user) {
      const newId = uuidv4();
      // [จุดที่พาร์ทเนอร์เคยติด] ส่ง Object ให้ตรงกับฟังก์ชัน createUser ใน db.js
      await db.createUser({
        id: newId,
        google_id: gId,
        email: googleUser.email,
        role: "user",
        credits: 0
      });
      user = await db.getUserByEmail(googleUser.email);
    }

    // MASTER BYPASS: เช็คสิทธิ์ Admin
    const finalRole = (user.email === 'narongsack.69@gmail.com') ? "admin" : user.role;

    const accessToken = tokenUtil.generateAccessToken({
      id: user.id,
      email: user.email,
      role: finalRole
    });

    // เซตคุกกี้บัตรผ่านใบจริง
    res.cookie("access_token", accessToken, { ...COOKIE_OPTIONS, maxAge: 24 * 60 * 60 * 1000 });
    
    // ล้างคุกกี้ขยะ
    res.clearCookie("oauth_state", COOKIE_OPTIONS);

    // [จบงาน] ดีดกลับไปหน้าจัดการ
    return res.redirect(`https://sn-designstudio.dev/create.html`);

  } catch (err) {
    console.error("❌ AUTH_CALLBACK_ERROR:", err.message);
    return res.status(500).json({ error: "GOOGLE_LOGIN_FAILED" });
  }
};

// ================= [3] GET FRESH PROFILE =================
exports.getMe = async (req, res) => {
  try {
    // ดึงข้อมูลสดจาก DB โดยใช้อีเมลจากบัตรผ่าน (req.user มาจาก Middleware)
    const user = await db.getUserByEmail(req.user.email);

    if (!user) {
      return res.status(404).json({ ok: false, error: "USER_NOT_FOUND" });
    }

    res.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        credits: user.credits || 0 // แต้มจะเด้งตรงนี้
      }
    });
  } catch (err) {
    console.error("❌ GET_ME_ERROR:", err);
    res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
};

