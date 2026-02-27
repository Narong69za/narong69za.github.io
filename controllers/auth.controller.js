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
      return res.status(400
