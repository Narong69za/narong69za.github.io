// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: routes/omise.webhook.js
// VERSION: v9.3.0
// STATUS: production-final
// LAYER: gateway
// RESPONSIBILITY:
// - verify omise webhook signature
// - strict idempotent event lock
// - atomic credit + payment log
// - safe buffer handling
// DEPENDS ON:
// - config/system.config.js
// - db/db.js
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

    // ===============================
    // SAFE RAW BODY
    // ===============================

    if (!Buffer.isBuffer(req.body)) {
      return res.status(400).send("INVALID_BODY_TYPE");
    }

    const expected = crypto
      .createHmac("sha256", secret)
      .update(req.body)
      .digest("hex");

    const valid =
      signature.length === expected.length &&
      crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expected)
      );

    if (!valid) {
      return res.status(403).send("INVALID_SIGNATURE");
    }

    const event = JSON.parse(req.body.toString());

    // ===============================
    // ONLY PROCESS CHARGE COMPLETE
    // ===============================

    if (event.key !== "charge.complete") {
      return res.status(200).send("IGNORED");
    }

    const charge = event.data;

    if (charge.status !== "successful") {
      return res.status(200).send("IGNORED");
    }

    const userId = String(charge.metadata?.userId || "");
    const credits = parseInt(charge.metadata?.credits || 0);
    const txId = charge.id;
    const eventId = event.id;

    if (!userId || credits <= 0 || !txId || !eventId) {
      return res.status(200).send("INVALID_METADATA");
    }

    // ===============================
    // ATOMIC BLOCK
    // ===============================

    await new Promise((resolve, reject) => {

      db.sqlite.serialize(() => {

        db.sqlite.run("BEGIN TRANSACTION");

        // Event Lock
        db.sqlite.get(
          "SELECT id FROM omise_events WHERE event_id = ?",
          [eventId],
          (err, row) => {

            if (err) {
              db.sqlite.run("ROLLBACK");
              return reject(err);
            }

            if (row) {
              db.sqlite.run("ROLLBACK");
              return resolve("DUPLICATE_EVENT");
            }

            db.sqlite.run(
              "INSERT INTO omise_events (event_id) VALUES (?)",
              [eventId]
            );

            // Payment duplicate protection
            db.sqlite.get(
              "SELECT id FROM payment_logs WHERE tx_id = ?",
              [txId],
              (err2, row2) => {

                if (err2) {
                  db.sqlite.run("ROLLBACK");
                  return reject(err2);
                }

                if (row2) {
                  db.sqlite.run("ROLLBACK");
                  return resolve("DUPLICATE_TX");
                }

                // Credit
                db.sqlite.run(
                  "UPDATE users SET credits = COALESCE(credits,0) + ? WHERE id = ?",
                  [credits, userId]
                );

                db.sqlite.run(
                  `INSERT INTO transactions
                   (id, user_id, type, amount, status)
                   VALUES (?, ?, 'topup', ?, 'success')`,
                  [uuidv4(), userId, credits]
                );

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
                    txId
                  ]
                );

                db.sqlite.run("COMMIT", (commitErr) => {
                  if (commitErr) {
                    db.sqlite.run("ROLLBACK");
                    return reject(commitErr);
                  }
                  resolve("OK");
                });

              }
            );
          }
        );
      });

    });

    return res.status(200).send("OK");

  } catch (err) {

    console.error("OMISE WEBHOOK ERROR:", err);
    return res.status(500).send("ERROR");

  }

});

module.exports = router;
