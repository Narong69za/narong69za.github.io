/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: services/omise.service.js
 * VERSION: v
 * STATUS: production
 * LAST FIX: 2026-03-08
 */

const Omise = require("omise");
const config = require("../config/payment.config");

const omise = Omise({
  secretKey: config.OMISE.SECRET_KEY
});

async function createCharge(product, user){

  const charge = await omise.charges.create({
    amount: product.amount,
    currency: product.currency.toLowerCase(),
    description: "SN DESIGN CREDIT",
    metadata: {
      userId: user.id,
      credits: product.credits
    }
  });

  return charge;
}

async function createTrueMoney(product, user){

  const source = await omise.sources.create({
    type: "truemoney",
    amount: product.amount,
    currency: product.currency.toLowerCase(),
    metadata: {
      userId: user.id,
      credits: product.credits
    }
  });

  return {
    authorizeUri: source.authorize_uri
  };
}

module.exports = { createCharge, createTrueMoney };
