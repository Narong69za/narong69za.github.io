const express = require('express');
const router = express.Router();
const Omise = require('omise');

const omise = Omise({
  publicKey: process.env.OMISE_PUBLIC,
  secretKey: process.env.OMISE_SECRET
});

router.post('/create', async (req, res) => {
  const charge = await omise.charges.create({
    amount: req.body.amount * 100,
    currency: 'thb',
    source: { type: 'promptpay' }
  });

  res.json({
    qr: charge.source.scannable_code.image.download_uri,
    chargeId: charge.id
  });
});

module.exports = router;
