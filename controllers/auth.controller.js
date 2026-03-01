/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: auth.controller.js
 * VERSION: v2.5.0
 * STATUS: production
 * LAST FIX: add cookie domain for cross-subdomain auth
 */

const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const googleService = require("../services/google.service");
const tokenUtil = require("../utils/token.util");
const db = require("../db/db");

// ===============================
// GOOGLE REDIRECT
// ===============================

exports.googleRedirect = async (req, res) => {
  const state = crypto.randomBytes(32).toString("hex");

  res.cookie("oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  const url = googleService.generateAuthUrl(state);
  return res.redirect(url);
};

// ===============================
// GOOGLE CALLBACK
// ===============================

exports.googleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    const storedState = req.cookies.oauth_state;

    if (!state || state !== storedState) {
      return res.status(400).json({ error: "Invalid state" });
    }

    const googleUser = await googleService.getUserFromCode(code);

    if (!googleUser || !googleUser.email) {
      return res.status(400).json({ error: "Invalid Google user data" });
    }

    let role = "user";

    if (googleUser.email === process.env.OWNER_EMAIL) {
      role = "owner";
    } else if (googleUser.email === process.env.DEV_EMAIL) {
      role = "dev";
    }

    let user = await db.getUserByEmail(googleUser.email);

    if (!user) {
      await db.createUser({
        id: uuidv4(),
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
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.redirect("https://sn-designstudio.dev/create.html");

  } catch (err) {
    console.error("AUTH CALLBACK ERROR:", err);
    return res.status(500).json({ error: "Auth failed" });
  }
};

// ===============================
// ME (DATABASE SYNC)
// ===============================

exports.me = async (req, res) => {
  try {

    const user = await db.getUserByEmail(req.user.email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      credits: user.credits ?? 0
    });

  } catch (err) {
    console.error("ME ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ===============================
// LOGOUT
// ===============================

exports.logout = async (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return res.json({ message: "Logged out" });
};
