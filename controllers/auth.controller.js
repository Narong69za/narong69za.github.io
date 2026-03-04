// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: controllers/auth.controller.js
// VERSION: v9.4.0
// STATUS: production-hardened
// LAST FIX:
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

// ================= GOOGLE REDIRECT =================

exports.googleRedirect = async (req, res) => {

  const state = crypto.randomBytes(32).toString("hex");

  const redirectTarget = req.query.redirect || "/create.html";

  res.cookie("oauth_state", state, {
    ...COOKIE_OPTIONS,
    maxAge: 10 * 60 * 1000
  });

  res.cookie("oauth_redirect", redirectTarget, {
    ...COOKIE_OPTIONS,
    maxAge: 10 * 60 * 1000
  });

  const url = googleService.generateAuthUrl(state);

  return res.redirect(url);
};


// ================= GOOGLE CALLBACK =================

exports.googleCallback = async (req, res) => {

  try {

    const { code, state } = req.query;
    const storedState = req.cookies.oauth_state;

    if (!state || state !== storedState) {
      return res.status(400).json({ error: "INVALID_OAUTH_STATE" });
    }

    const googleUser = await googleService.getUserFromCode(code);

    if (!googleUser?.email) {
      return res.status(400).json({ error: "INVALID_GOOGLE_USER" });
    }

    let role = "user";

    if (googleUser.email === process.env.OWNER_EMAIL) role = "owner";
    if (googleUser.email === process.env.DEV_EMAIL) role = "dev";

    let user = await db.getUserByEmail(googleUser.email);

    if (!user) {

      const newId = uuidv4();

      await db.createUser({
        id: newId,
        googleId: googleUser.id,
        email: googleUser.email,
        role
      });

      user = await db.getUserByEmail(googleUser.email);
    }

    const accessToken = tokenUtil.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    const refreshToken = tokenUtil.generateRefreshToken({
      id: user.id
    });

    res.cookie("access_token", accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 60 * 60 * 1000
    });

    res.cookie("refresh_token", refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
