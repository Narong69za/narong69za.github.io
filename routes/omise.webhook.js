/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: routes/omise.webhook.js
 * VERSION: v2.3.0
 * STATUS: production
 * LAST FIX:
 * - FORCE RAW BUFFER VERIFY
 * - SUPPORT HEX VERIFY
 * - SAFE BUFFER FALLBACK
 */

const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const db = require("../db/db");
const { v4: uuidv4 } = require("uuid");

router.post("/", async (req, res) => {
  try {

    const signature = req.headers["x-omise-signature"];
    const secret = process.env.OMISE_WEBHOOK_SECRET;

    console.log("=== OMISE WEBHOOK START ===");
    console.log("HEADER SIGNATURE:", signature);
    console.log("IS BUFFER:", Buffer.isBuffer(req.body));

    if (!signature || !secret) {
      console.log("MISSING SIGNATURE OR SECRET");
      return res.status(401).send("NO SIGNATURE");
    }

    // 🔥 FORCE BUFFER (กันกรณี body ถูก parse)
    const rawBody = Buffer.isBuffer(req.body)
      ? req.body
      : Buffer.from(JSON.stringify(req.body));

    const expected = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    console.log("EXPECTED:", expected);

    if (expected !== signature) {
      console.log("WEBHOOK: Signature mismatch");
      return res.status(403).send("INVALID SIGNATURE");
    }

    const event = JSON.parse(rawBody.toString());

    if (event.key === "charge.complete") {

      const charge = event.data;

      if (charge.status === "successful") {

        const userId = charge.metadata?.userId;
        const credits = parseInt(charge.metadata?.credits || 0);

        if (userId && credits > 0) {

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

          console.log("WEBHOOK CREDIT ADDED:", credits);
        }
      }
    }

    console.log("=== OMISE WEBHOOK SUCCESS ===");
    res.status(200).send("OK");

  } catch (err) {
    console.error("WEBHOOK ERROR:", err);
    res.status(500).send("ERROR");
  }
});

module.exports = router;
