// ======================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: stripe.webhook.js
// VERSION: 2.0.0
// STATUS: production
// LAST FIX: DIRECT STRIPE constructEvent WITH RAW BODY
// ======================================================

const express = require("express");
const router = express.Router();

const Stripe = require("stripe");
const db = require("../db/db");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ======================================================
// STRIPE WEBHOOK
// ======================================================

router.post("/", async (req, res) => {

  const sig = req.headers["stripe-signature"];

  let event;

  try {

    // 🔴 ต้องใช้ req.body (RAW BUFFER)
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

  } catch (err) {

    console.error("❌ Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);

  }

  // ======================================================
  // CHECKOUT SUCCESS
  // ======================================================

  if (event.type === "checkout.session.completed") {

    const session = event.data.object;

    const userId = session?.metadata?.userId;
    const credits = parseInt(session?.metadata?.credits || 0);

    if (!userId || !credits) {
      console.error("⚠ Invalid metadata in webhook");
      return res.json({ received: true });
    }

    console.log("💰 PAYMENT SUCCESS:", userId, credits);

    try {

      await db.addCredit(userId, credits);

      console.log("✅ CREDIT ADDED:", credits);

    } catch (err) {

      console.error("❌ DB CREDIT ERROR:", err);

    }

  }

  res.json({ received: true });

});

module.exports = router;
