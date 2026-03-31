const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const googleService = require("../services/google.service");
const tokenUtil = require("../utils/token.util");
const db = require("../db/db"); // <--- ต้องมีตัวนี้เพื่อคุยกับฐานข้อมูล

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  domain: ".sn-designstudio.dev",
  path: "/"
};

exports.googleRedirect = async (req, res) => {
  try {
    const state = crypto.randomBytes(32).toString("hex");
    res.cookie("oauth_state", state, { ...COOKIE_OPTIONS, maxAge: 10 * 60 * 1000 });
    return res.redirect(googleService.generateAuthUrl(state));
  } catch (err) {
    return res.redirect("https://sn-designstudio.dev/login.html?error=setup_failed");
  }
};

exports.googleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    const storedState = req.cookies.oauth_state;

    if (!state || state !== storedState) return res.status(400).json({ error: "INVALID_OAUTH_STATE" });

    const googleUser = await googleService.getUserFromCode(code);
    
    // --- จุดเช็คฐานข้อมูล ---
    let user = await db.getUserByEmail(googleUser.email);
    if (!user) {
      const newId = uuidv4();
      await db.createUser({ id: newId, googleId: googleUser.id, email: googleUser.email, role: "user" });
      user = await db.getUserByEmail(googleUser.email);
    }

    const accessToken = tokenUtil.generateAccessToken({ id: user.id, email: user.email, role: user.role });
    res.clearCookie("oauth_state", COOKIE_OPTIONS);

    // [SUCCESS] ส่งกลับพร้อม Token
    return res.redirect(`https://sn-designstudio.dev/create.html?token=${accessToken}`);
  } catch (err) {
    return res.status(500).json({ error: "GOOGLE_LOGIN_FAILED" });
  }
};

