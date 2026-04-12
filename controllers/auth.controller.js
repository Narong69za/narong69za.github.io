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
  path: "/",
  partitioned: true
};

// [NEW] ฟังก์ชัน Verify สำหรับ auth.js (GIS v3)
exports.verifyGoogleToken = async (req, res) => {
  try {
    const { token } = req.body;
    const googleUser = await googleService.getUserFromToken(token); // ดึงข้อมูลจาก JWT Google
    
    let user = await db.getUserByEmail(googleUser.email);
    if (!user) {
      await db.createUser({ id: uuidv4(), google_id: googleUser.sub, email: googleUser.email, role: "user", credits: 0 });
      user = await db.getUserByEmail(googleUser.email);
    }

    const accessToken = tokenUtil.generateAccessToken({ id: user.id, email: user.email, role: user.role });
    res.cookie("access_token", accessToken, { ...COOKIE_OPTIONS, maxAge: 24 * 60 * 60 * 1000 });

    res.json({ ok: true, user: { email: user.email, role: user.role, credits: user.credits } });
  } catch (err) {
    res.status(401).json({ ok: false, error: "VERIFY_FAILED" });
  }
};

// ... ฟังก์ชัน googleRedirect, googleCallback, getMe (ตัวเดิมของพี่ที่กูส่งให้รอบที่แล้ว) ...

