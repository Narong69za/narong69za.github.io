/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: config/payment.config.js
 * VERSION: v
 * STATUS: production
 * LAST FIX: 2026-03-08
 */

module.exports = {

  ENV: process.env.PAYMENT_ENV || "test",

  PRODUCTS: {
    credit_pack_1: {
      amount: 9900,
      credits: 100,
      currency: "THB"
    },
    credit_pack_2: {
      amount: 19900,
      credits: 250,
      currency: "THB"
    }
  },

  OMISE: {
    PUBLIC_KEY: process.env.OMISE_PUBLIC_KEY,
    SECRET_KEY: process.env.OMISE_SECRET_KEY,
    ENABLED: true
  },

  SCB: {
    API_KEY: process.env.SCB_API_KEY,
    API_SECRET: process.env.SCB_API_SECRET,
    ENABLED: true
  },

  CRYPTO: {
    API_KEY: process.env.BINANCE_API_KEY,
    ENABLED: true
  }

};
