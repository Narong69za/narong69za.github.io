/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: routes/omise.webhook.js
 * VERSION: v2.3.0
 * STATUS: production
 * LAST FIX:
 * - FIX signature header name
 * - FIX base64 HMAC validation
 * - STRICT charge.complete handling
 */

const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const db = require("../db/db");
const { v4: uuidv4 } = require("uuid");

router.post("/", async (req, res) => {

  try {

    const signature = req.headers["omise-signature"];
    const secret = process.env.OMISE_WEBHOOK_SECRET;
    console.log("=== OMISE WEBHOOK DEBUG START ===");
    console.log("SIGNATURE HEADER:", signature);
    console.log("WEBHOOK SECRET LOADED:", secret ? "YES" : "NO");
    console.log("RAW BODY TYPE:", typeof req.body);
    console.log("RAW BODY LENGTH:", req.body?.length);
    console.log("RAW BODY PREVIEW:", req.body?.toString()?.slice(0,100));
    console.log("=== OMISE WEBHOOK DEBUG END ===");
    if (!signature || !secret) {
      console.log("WEBHOOK: Missing signature or secret");
      return res.status(401).send("NO SIGNATURE");
    }

    const expected = crypto
      .createHmac("sha256", secret)
      .update(req.body)
      .digest("base64");

    if (expected !== signature) {
      console.log("WEBHOOK: Signature mismatch");
      return res.status(403).send("INVALID SIGNATURE");
    }

    const event = JSON.parse(req.body.toString());

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

    res.status(200).send("OK");

  } catch (err) {

    console.error("WEBHOOK ERROR:", err);
    res.status(500).send("ERROR");
  }

});

module.exports = router;
