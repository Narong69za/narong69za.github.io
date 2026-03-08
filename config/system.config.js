/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: config/system.config.js
 * VERSION: v
 * STATUS: production-final
 * LAYER: config
 * RESPONSIBILITY:
 * - centralize environment configuration
 * DEPENDS ON:
 * - process.env
 * LAST FIX: 2026-03-08
 * - production final lock configuration layer
 * =====================================================
 */

require("dotenv").config();

module.exports = {

  ENV: process.env.NODE_ENV || "production",

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,

  DB_PATH: process.env.DB_PATH || "/var/data/database.sqlite",

  PAYMENT_ENV: process.env.PAYMENT_ENV || "production",

  OMISE_PUBLIC_KEY: process.env.OMISE_PUBLIC_KEY,
  OMISE_SECRET_KEY: process.env.OMISE_SECRET_KEY,
  OMISE_WEBHOOK_SECRET: process.env.OMISE_WEBHOOK_SECRET,

  SCB_API_KEY: process.env.SCB_API_KEY,
  SCB_API_SECRET: process.env.SCB_API_SECRET,

  BINANCE_API_KEY: process.env.BINANCE_API_KEY

};
