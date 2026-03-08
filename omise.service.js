// =====================================================
// PROJECT: SN DESIGN ENGINE AI
// MODULE: services/omise.service.js
// VERSION: v
// STATUS: test
// LAST FIX: 2026-03-08
// =====================================================

const Omise = require("omise");

const omise = Omise({
  publicKey: process.env.OMISE_PUBLIC_KEY,
  secretKey: process.env.OMISE_SECRET_KEY,
});

async function createCharge({ amount, token, metadata }) {
  return await omise.charges.create({
    amount,
    currency: "thb",
    card: token,
    metadata,
  });
}

module.exports = {
  createCharge,
};
