const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// CREDIT POLICY
const { calculateCreditFromTHB } = require("../config/credit.policy");

// DB
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("/root/sn-payment-core/database.db");

// ===============================
// STRIPE WEBHOOK
// ===============================
router.post("/", async (req, res) => {

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Stripe Verify Fail:", err.message);
    return res.status(400).send("Webhook Error");
  }

  // ===============================
  // CHECK EVENT TYPE
  // ===============================
  if (event.type === "checkout.session.completed") {

    const session = event.data.object;

    const email = session.metadata?.email;
    const amountTHB = parseInt(session.metadata?.amount);

    // � กันข้อมูลหาย
    if (!email || !amountTHB) {
      console.error("❌ INVALID METADATA");
      return res.json({ received: true });
    }

    try {
      const credit = calculateCreditFromTHB(amountTHB);

      // � กัน webhook ซ้ำ (สำคัญมาก)
      db.get(`
        SELECT id FROM transactions
        WHERE email = ?
        AND amount_thb = ?
        ORDER BY timestamp DESC
        LIMIT 1
      `, [email, amountTHB], (err, row) => {

        if (row) {
          console.log("⚠️ DUPLICATE PAYMENT SKIPPED:", email);
          return;
        }

        db.serialize(() => {

          // ✅ เพิ่มเครดิต
