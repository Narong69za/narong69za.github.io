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

exports.googleRedirect = async (req, res) => {
  try {
    const state = crypto.randomBytes(32).toString("hex");
    res.cookie("oauth_state", state, { ...COOKIE_OPTIONS, maxAge: 600000 });
    return res.redirect(googleService.generateAuthUrl(state));
  } catch (err) {
    return res.redirect("https://sn-designstudio.dev/login.html?error=setup_failed");
  }
};

exports.googleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    const storedState = req.cookies.oauth_state;
    if (!state || state !== storedState) return res.status(400).json({ error: "INVALID_STATE" });

    const googleUser = await googleService.getUserFromCode(code);
    let user = await db.getUserByEmail(googleUser.email);

    if (!user) {
      await db.createUser({
        id: uuidv4(),
        google_id: googleUser.id,
        email: googleUser.email,
        role: "user",
        credits: 0
      });
      user = await db.getUserByEmail(googleUser.email);
    }

    const accessToken = tokenUtil.generateAccessToken({ id: user.id, email: user.email, role: user.role });
    res.cookie("access_token", accessToken, { ...COOKIE_OPTIONS, maxAge: 3600000 });
    res.clearCookie("oauth_state", COOKIE_OPTIONS);

    return res.redirect(`https://sn-designstudio.dev/create.html`);
  } catch (err) {
    return res.status(500).json({ error: "GOOGLE_LOGIN_FAILED" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await db.getUserByEmail(req.user.email);
    if (!user) return res.status(404).json({ ok: false });
    res.json({ ok: true, user: { email: user.email, role: user.role, credits: user.credits } });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
};

