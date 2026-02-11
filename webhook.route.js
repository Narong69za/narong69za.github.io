const express = require('express');
const router = express.Router();
const credit = require('../services/credit.service');

router.post('/payment', async (req, res) => {
  const event = req.body;
  if (event.key === 'charge.complete') {
    const amount = event.data.amount / 100;
    const ip = event.data.metadata?.ip || 'unknown';
    await credit.addCredit(ip, amount);
  }
  res.sendStatus(200);
});

module.exports = router;
