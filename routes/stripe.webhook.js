// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: routes/stripe.webhook.js
// VERSION: v
// STATUS: production-final
// LAYER: gateway
// RESPONSIBILITY:
// - verify stripe webhook signature
// - idempotent event protection
// - atomic credit add
// - insert payment log
// DEPENDS ON:
// - config/credit.policy.js
// - db/db.js
// - services/stripe.service.js
// LAST FIX: 2026-03-08
// - added idempotent lock
// - unified credit logic
// - hardened metadata validation
// =====================================================

const express = require("express");
const router = express.Router();

const stripeService = require("../services/stripe.service");
const db = require("../db/db");
const CREDIT_POLICY = require("../config/credit.policy");

// ======================================================
// STRIPE WEBHOOK
// ======================================================

router.post("/", async (req, res) => {

  const sig = req.headers["stripe-signature"];
  let event;

  try {

    event = stripeService.constructWebhookEvent(
      req.body,
      sig
    );

  } catch (err) {

    console.error("Stripe signature error:", err.message);
    return res.status(400).send("INVALID_SIGNATURE");

  }

  // ======================================================
  // CHECKOUT SUCCESS
  // ======================================================

  if (event.type === "checkout.session.completed") {

    const session = event.data.object;

    const stripeSessionId = session.id;
    const userId = session?.metadata?.userId;

    if (!userId) {
      return res.json({ received: true });
    }

    // ===============================
    // IDEMPOTENT LOCK
    // ===============================

    const existing = await new Promise((resolve, reject) => {
      db.sqlite.get(
        "SELECT id FROM payment_logs WHERE tx_id = ?",
        [stripeSessionId],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });

    if (existing) {
      return res.status(200).json({ duplicate: true });
    }

    // ===============================
    // CREDIT CALCULATION
    // ===============================

    let credits = parseInt(session?.metadata?.credits || 0);

    // Fallback to policy calculation if not provided
    if (!credits) {

      const amountTHB = session.amount_total / 100; // Stripe in satang
      const base = amountTHB * CREDIT_POLICY.BASE_RATE;

      const tier = CREDIT_POLICY.BONUS_TIERS
        .filter(t => amountTHB >= t.min)
        .sort((a,b)=>b.min-a.min)[0];

      credits = tier
        ? Math.floor(base + (base * tier.bonusPercent / 100))
        : Math.floor(base);
    }

    try {

      // ===============================
      // ATOMIC CREDIT ADD
      // ===============================

      await db.addCredit(userId, credits);

      await new Promise((resolve, reject) => {
        db.sqlite.run(
          `INSERT INTO payment_logs
           (id,user_id,method,amount,currency,status,tx_id)
           VALUES (?,?,?,?,?,?,?)`,
          [
            crypto.randomUUID(),
            userId,
            "stripe",
            session.amount_total / 100,
            session.currency?.toUpperCase() || "THB",
            "success",
            stripeSessionId
          ],
          function (err) {
            if (err) return reject(err);
            resolve(true);
          }
        );
      });

      console.log("Stripe credit added:", credits);

    } catch (err) {

      console.error("Stripe credit error:", err);

    }

  }

  res.json({ received: true });

});

module.exports = router;
