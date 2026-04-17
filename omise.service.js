// =====================================================
// PROJECT: SN DESIGN ENGINE AI
// MODULE: services/omise.service.js
// VERSION: 1.0.0
// STATUS: test
// LAST FIX: initial test-mode implementation
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
