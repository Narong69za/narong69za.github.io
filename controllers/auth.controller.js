/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: auth.controller.js
 * VERSION: v2.1.0
 * STATUS: production
 * LAST FIX: align with production DB schema + safe JWT payload
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
    sameSite: "strict"
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

    // 🔎 เช็ค user จาก email ก่อน
    let user = await db.getUserByEmail(googleUser.email);

    // 🆕 ถ้าไม่มี → สร้างใหม่
    if (!user) {
      user = await db.createUser({
        id: uuidv4(),
        googleId: googleUser.id,
        email: googleUser.email,
        role
      });
    }

    // 🧠 ถ้ามีอยู่แล้ว แต่ role ต้อง upgrade
    if (user && role !== user.role) {
      user.role = role;
    }

    // ===============================
    // JWT
    // ===============================

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
    console.error("AUTH CALLBACK ERROR:", err);
    return res.status(500).json({ error: "Auth failed" });
  }
};

// ===============================
// ME
// ===============================

exports.me = async (req, res) => {
  return res.json(req.user);
};

// ===============================
// LOGOUT
// ===============================

exports.logout = async (req, res) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  return res.json({ message: "Logged out" });
};
