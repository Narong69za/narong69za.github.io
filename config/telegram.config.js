/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: TELEGRAM BOT CONFIG
 * FILE: config/telegram.config.js
 * VERSION: 1.0.0
 * STATUS: ACTIVE
 * LAST FIX: Initial telegram bot config
 * =====================================================
 */

require("dotenv").config();

module.exports = {
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN || "",
  BOT_NAME: "SN Design Bot",
  ADMIN_ID: process.env.TELEGRAM_ADMIN || ""
};
