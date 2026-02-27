/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: auth.controller.js
 * VERSION: v2.0.0
 * STATUS: production
 * LAST FIX: add OWNER/DEV role system + JWT cookie
 */

const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const googleService = require("../services/google.service");
const tokenUtil = require("../utils/token.util");
const db = require("../db/db");

exports.googleRedirect = async (req, res) => {
  const state = crypto.randomBytes(32).toString("hex");

  res.cookie("oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "strict"
  });

  const url = googleService.generateAuthUrl(state);
  return res.redirect(url);
};

exports.googleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    const storedState = req.cookies.oauth_state;

    if (!state || state !== storedState) {
      return res.status(400).json({ error: "Invalid state" });
    }

    const googleUser = await googleService.getUserFromCode(code);

    let role = "user";

    if (googleUser.email === process.env.OWNER_EMAIL) {
      role = "owner";
    } else if (googleUser.email === process.env.DEV_EMAIL) {
      role = "dev";
    }

    let user = await db.getUserByEmail(googleUser.email);

    if (!user) {
      user = await db.createUser({
        id: uuidv4(),
        email: googleUser.email,
        role
      });
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
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    });

    return res.redirect("https://sn-designstudio.dev/create.html");

  } catch (err) {
    console.error("AUTH CALLBACK ERROR:", err.message);
    return res.status(500).json({ error: "Auth failed" });
  }
};

exports.me = async (req, res) => {
  return res.json(req.user);
};

exports.logout = async (req, res) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  return res.json({ message: "Logged out" });
};
