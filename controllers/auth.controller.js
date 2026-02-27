/**
 * =====================================================
 * SN DESIGN STUDIO AUTH CONTROLLER
 * VERSION: v1.0.1-production-fixed
 * =====================================================
 */

const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const googleService = require("../services/google.service");
const tokenUtil = require("../utils/token.util");
const sqlite3 = require("sqlite3").verbose();

const DB_PATH = process.env.DB_PATH || "./db/database.sqlite";
const db = new sqlite3.Database(DB_PATH);

// ===============================
// GOOGLE REDIRECT
// ===============================

exports.googleRedirect = async (req, res) => {
  const state = crypto.randomBytes(32).toString("hex");

  res.cookie("oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax"
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

    const tokens = await googleService.getTokens(code);
    const profile = await googleService.getUserProfile(tokens.access_token);

    if (!profile.verified_email) {
      return res.status(403).json({ error: "Email not verified" });
    }

    const userId = uuidv4();

    db.get(
      "SELECT * FROM users WHERE google_id = ?",
      [profile.id],
      (err, existingUser) => {
        if (err) return res.status(500).json({ error: err.message });

        if (existingUser) {
          issueToken(existingUser);
        } else {
          db.run(
            `INSERT INTO users (id, google_id, email)
             VALUES (?, ?, ?)`,
            [userId, profile.id, profile.email],
            function (err) {
              if (err)
                return res.status(500).json({ error: err.message });

              db.run(
                `INSERT INTO user_credits (user_id, credits)
                 VALUES (?, 0)`,
                [userId]
              );

              issueToken({
                id: userId,
                email: profile.email,
                role: "user",
                subscription: "free"
              });
            }
          );
        }
      }
    );

    function issueToken(user) {
      const accessToken = tokenUtil.generateAccessToken(user);
      const refreshToken = tokenUtil.generateRefreshToken(user);

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 15
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7
      });

      res.clearCookie("oauth_state");

      return res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Authentication failed" });
  }
};

// ===============================
// CURRENT USER
// ===============================

exports.me = (req, res) => {
  res.json({ user: req.user });
};

exports.logout = (req, res) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.json({ message: "Logged out" });
};
