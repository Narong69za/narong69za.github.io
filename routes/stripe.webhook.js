const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const sqlite3 = require("sqlite3").verbose();
const { v4: uuidv4 } = require("uuid");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const db = new sqlite3.Database("/root/sn-payment-core/database.db");

const {
  calculateCreditFromTHB
} = require("../config/credit.policy");

// ===============================
// WEBHOOK
// ===============================
router.post("/stripe", express.raw({ type: "application/json" }), async (req, res) => {

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ SIGNATURE FAIL:", err.message);
    return res.status(400).send("Webhook Error");
  }

  if (event.type === "checkout.session.completed") {

    const session = event.data.object;

    const email = session.metadata.email;
    const amountTHB = parseInt(session.metadata.amount);
    const stripeEventId = event.id;

    //  �ป้องกัน webhook ซ้ำ
    db.get("SELECT event_id FROM omise_events WHERE event_id = ?", [stripeEventId], (err, row) => {
      if (row) {
        console.log("⚠️ DUPLICATE EVENT SKIPPED");
        return;
      }

      // บันทึก event กันซ้ำ
      db.run("INSERT INTO omise_events (event_id) VALUES (?)", [stripeEventId]);

      db.get("SELECT id, credits FROM users WHERE email = ?", [email], (err, user) => {

        if (!user) {
          console.error("❌ USER NOT FOUND:", email);
          return;
        }

        const credit = calculateCreditFromTHB(amountTHB);

        // ===============================
        // 1. UPDATE CREDIT
        // ===============================
        db.run(
          "UPDATE users SET credits = credits + ? WHERE id = ?",
          [credit.totalCredit, user.id]
        );

        // ===============================
        // 2. CREDIT TRANSACTION (LEDGER)
        // ===============================
        db.run(
          `INSERT INTO credit_transactions (id, user_id, amount, type, description)
           VALUES (?, ?, ?, ?, ?)`,
          [
            uuidv4(),
            user.id,
            credit.totalCredit,
            "topup",
            `Stripe Topup ${amountTHB} THB`
          ]
        );

        // ===============================
        // 3. PAYMENT LOG
        // ===============================
        db.run(
          `INSERT INTO transactions (email, amount_thb, credit_received)
           VALUES (?, ?, ?)`,
          [email, amountTHB, credit.totalCredit]
        );

        console.log("✅ PAYMENT SUCCESS:", email, credit.totalCredit);

        // polling
        global.paymentStatus = global.paymentStatus || {};
        global.paymentStatus[email] = true;

      });
    });
  }

  res.json({ received: true });
});

// ===============================
// POLLING
// ===============================
router.get("/check-status", (req, res) => {

  const { email } = req.query;

  if (!email) return res.json({ paid: false });

  if (global.paymentStatus && global.paymentStatus[email]) {
    global.paymentStatus[email] = false;
    return res.json({ paid: true });
  }

  return res.json({ paid: false });
});

module.exports = router;
