// ======================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: omise.service.js
// VERSION: 1.0.0
// STATUS: production
// ======================================================

const Omise = require("omise")({
  publicKey: process.env.OMISE_PUBLIC_KEY,
  secretKey: process.env.OMISE_SECRET_KEY,
});

exports.createCharge = async ({ amount, returnUri, metadata }) => {

  return await Omise.charges.create({
    amount,
    currency: "thb",
    return_uri: returnUri,
    metadata
  });

};
