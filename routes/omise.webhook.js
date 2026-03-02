/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: routes/omise.webhook.js
 * VERSION: v2.1.0
 * STATUS: production
 * LAST FIX: TrueWallet fully supported via metadata credits
 */

const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const db = require("../db/db");

router.post("/", async (req, res) => {

  try {

    const signature = req.headers["omise-signature"];
    const secret = process.env.OMISE_WEBHOOK_SECRET;

    if (!signature || !secret) {
      return res.status(401).send("NO SIGNATURE");
    }

    const expected = crypto
      .createHmac("sha256", secret)
      .update(req.body)
      .digest("hex");

    if (expected !== signature) {
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
