// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: controllers/auth.controller.js
// VERSION: v9.3.0
// STATUS: production-final
// LAYER: auth-core
// RESPONSIBILITY:
// - google oauth
// - secure cookie issuance
// - db sync with v9 schema
// - prevent redirect loop
// DEPENDS ON:
// - services/google.service.js
// - utils/token.util.js
// - db/db.js
// LAST FIX:
// - hardened cookie policy for HTTPS production
// - added domain support
// - fixed /me DB query
// - improved security validation
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

// =====================================================
// GOOGLE REDIRECT
// =====================================================

exports.googleRedirect = async (req, res) => {

  const state = crypto.randomBytes(32).toString("hex");

  res.cookie("oauth_state", state, {
    ...COOKIE_OPTIONS,
    maxAge: 10 * 60 * 1000
  });

  const url = googleService.generateAuthUrl(state);
  return res.redirect(url);
};

// =====================================================
// GOOGLE CALLBACK
// =====================================================

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

    // ===============================
    // ROLE ASSIGNMENT
    // ===============================

    let role = "user";

    if (googleUser.email === process.env.OWNER_EMAIL) {
      role = "owner";
    } else
