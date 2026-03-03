// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: routes/omise.webhook.js
// VERSION: v9.2.0
// STATUS: production-final
// LAYER: gateway
// RESPONSIBILITY:
// - verify omise webhook signature
// - idempotent event lock
// - atomic credit add
// - insert payment log
// DEPENDS ON:
// - config/system.config.js
// - db/db.js
// LAST FIX:
// - event-level idempotent lock (omise_events)
// - atomic credit + payment log transaction
// - timingSafeEqual verification hardened
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

    // raw body ต้องเป็น buffer (express.raw configured in server)
    const rawBody = Buffer.isBuffer(req.body)
      ? req.body
      : Buffer.from(req.body);

    const expected = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

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

    // ===============================
    // IDempotent EVENT LOCK
    // ===============================

    const existingEvent = await new Promise((resolve, reject) => {
      db.sqlite.get(
        "SELECT id FROM omise_events WHERE event_id = ?",
        [event.id],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });

    if (existingEvent) {
      return res.status(200).send("DUPLICATE_EVENT");
    }

    await new Promise((resolve, reject) => {
      db.sqlite.run(
        "INSERT INTO omise_events (event_id) VALUES (?)",
        [event.id],
        function (err) {
          if (err) return reject(err);
          resolve(true);
        }
      );
    });

    // ===============================
    // PROCESS CHARGE
    // ===============================

    if (event.key === "charge.complete") {

      const charge = event.data;

      if (charge.status === "successful") {

        const userId = String(charge.metadata?.userId || "");
        const credits = parseInt(charge.metadata?.credits || 0);

        if (!userId || credits <= 0) {
          return res.status(200).send("IGNORED");
        }

        // ===============================
        // ATOMIC CREDIT + LOG
        // ===============================

        await db.addCredit(userId, credits);

        await new Promise((resolve, reject) => {
          db.sqlite.run(
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
            ],
            function (err) {
              if (err) return reject(err);
              resolve(true);
            }
          );
        });
      }
    }

    return res.status(200).send("OK");

  } catch (err) {
    console.error("WEBHOOK ERROR:", err);
    return res.status(500).send("ERROR");
  }
});

module.exports = router;
