// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: routes/omise.webhook.js
// VERSION: v9.1.0
// STATUS: production-final
// LAYER: gateway
// RESPONSIBILITY:
// - verify omise webhook signature
// - add user credit
// - insert payment log
// DEPENDS ON:
// - config/system.config.js
// - db/db.js
// LAST FIX:
// - centralized webhook secret
// - timingSafeEqual verification
// - idempotent protection
// =====================================================

const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const db = require("../db/db");
const { v4: uuidv4 } = require("uuid");
const config = require("../config/system.config");

router.post("/", async (req, res) => {
  try {

    const signature = req.headers["x-omise-signature"];
    const secret = config.OMISE_WEBHOOK_SECRET;

    if (!signature || !secret) {
      return res.status(401).send("NO SIGNATURE");
    }

    // raw body ต้องเป็น buffer (server.js ตั้ง express.raw แล้ว)
    const rawBody = Buffer.isBuffer(req.body)
      ? req.body
      : Buffer.from(req.body);

    const expected = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    // timing safe compare
    const valid =
      signature.length === expected.length &&
      crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expected)
      );

    if (!valid) {
      return res.status(403).send("INVALID SIGNATURE");
    }

    const event = JSON.parse(rawBody.toString());

    if (event.key === "charge.complete") {

      const charge = event.data;

      if (charge.status === "successful") {

        const userId = String(charge.metadata?.userId || "");
        const credits = parseInt(charge.metadata?.credits || 0);

        if (!userId || credits <= 0) {
          return res.status(200).send("IGNORED");
        }

        // 🔒 IDempotent: ป้องกันเครดิตซ้ำ
        const exists = await db.sqlite.get(
          "SELECT id FROM payment_logs WHERE tx_id = ?",
          [charge.id]
        );

        if (exists) {
          return res.status(200).send("ALREADY_PROCESSED");
        }

        await db.addCredit(userId, credits);

        await db.sqlite.run(
          `INSERT INTO payment_logs
           (id,user_id,method,amount,currency,status,tx_id)
           VALUES (?,?,?,?,?,?,?)`,
          [
            uuidv4(),
            userId,
            "omise",
            charge.amount,
            charge.currency,
            "success",
            charge.id
          ]
        );
      }
    }

    return res.status(200).send("OK");

  } catch (err) {
    console.error("WEBHOOK ERROR:", err);
    return res.status(500).send("ERROR");
  }
});

module.exports = router;
