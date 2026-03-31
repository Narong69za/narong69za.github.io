const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// ตัวรับ Webhook จาก Stripe
router.post("/stripe", express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // --- จุดนี้พี่เขียน Logic เติมเครดิตลง Database ได้เลย ---
    console.log(" STRIPE PAYMENT SUCCESS:", session.id);
  }

  res.json({received: true});
});

module.exports = router;
