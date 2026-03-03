// ======================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: routes/stripe.webhook.js
// VERSION: v9.0.0
// STATUS: production-final
// LAYER: gateway
// RESPONSIBILITY:
// - verify stripe webhook
// - idempotent protection
// - add credit
// - insert payment log
// DEPENDS ON:
// - services/stripe.service.js
// - db/db.js
// ======================================================

const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

const stripeService = require("../services/stripe.service");
const db = require("../db/db");

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

    const userId = session?.metadata?.userId;
    const credits = parseInt(session?.metadata?.credits || 0);
    const txId = session?.id;

    if (!userId || !credits || !txId) {
      console.error("Stripe invalid metadata");
      return res.status(200).json({ received: true });
    }

    try {

      // 🔒 IDempotent check
      const exists = await new Promise((resolve, reject) => {
        db.sqlite.get(
          "SELECT id FROM payment_logs WHERE tx_id = ?",
          [txId],
          (err, row) => {
            if (err) return reject(err);
            resolve(row);
          }
        );
      });

      if (exists) {
        console.log("Stripe webhook duplicate ignored:", txId);
        return res.status(200).json({ received: true });
      }

      // 🔥 Add credit
      await db.addCredit(userId, credits);

      // 🧾 Insert payment log
      await new Promise((resolve, reject) => {
        db.sqlite.run(
          `INSERT INTO payment_logs
           (id,user_id,method,amount,currency,status,tx_id)
           VALUES (?,?,?,?,?,?,?)`,
          [
            uuidv4(),
            userId,
            "stripe",
            session.amount_total || 0,
            session.currency || "thb",
            "success",
            txId
          ],
          (err) => {
            if (err) return reject(err);
            resolve(true);
          }
        );
      });

      console.log("✅ Stripe credit added:", credits);

    } catch (err) {

      console.error("Stripe webhook DB error:", err);

    }

  }

  return res.status(200).json({ received: true });

});

module.exports = router;
