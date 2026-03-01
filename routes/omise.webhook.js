// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: omise.webhook.js
// VERSION: v1.1.0
// STATUS: production
// LAST FIX: FORCE RAW BODY PARSER FOR SIGNATURE VERIFY (FIX 401 ISSUE)
// =====================================================

const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const creditEngine = require("../services/credit.engine");
const { sqlite } = require("../db/db");

// =====================================================
// RAW BODY MIDDLEWARE (CRITICAL)
// =====================================================

router.use(
   express.raw({
      type: "*/*"
   })
);

// =====================================================
// VERIFY SIGNATURE
// =====================================================

function verifyOmiseSignature(req) {

   const secret = process.env.OMISE_WEBHOOK_SECRET;
   if (!secret) return false;

   const signature = req.headers["x-omise-signature"];
   if (!signature) return false;

   const expected = crypto
      .createHmac("sha256", secret)
      .update(req.body)
      .digest("hex");

   return signature === expected;
}

// =====================================================
// WEBHOOK
// =====================================================

router.post("/", async (req, res) => {

   try {

      const isValid = verifyOmiseSignature(req);

      if (!isValid) {
         return res.status(401).send("invalid signature");
      }

      const event = JSON.parse(req.body.toString());

      // =====================================================
      // IDEMPOTENCY CHECK
      // =====================================================

      const existing = await new Promise((resolve, reject) => {
         sqlite.get(
            "SELECT id FROM omise_events WHERE event_id = ?",
            [event.id],
            (err, row) => {
               if (err) return reject(err);
               resolve(row);
            }
         );
      });

      if (existing) {
         return res.status(200).send("duplicate");
      }

      await new Promise((resolve, reject) => {
         sqlite.run(
            "INSERT INTO omise_events (event_id) VALUES (?)",
            [event.id],
            (err) => {
               if (err) return reject(err);
               resolve();
            }
         );
      });

      // =====================================================
      // HANDLE SUCCESSFUL CHARGE
      // =====================================================

      if (event.key === "charge.complete") {

         const charge = event.data;

         if (charge.status === "successful") {

            const metadata = charge.metadata || {};
            const userId = metadata.userId;
            const packageName = metadata.package;

            if (userId && packageName) {

               await creditEngine.addCreditFromPackage(
                  userId,
                  packageName,
                  charge.amount
               );

            }

         }

      }

      res.status(200).send("ok");

   } catch (err) {

      console.error("OMISE WEBHOOK ERROR:", err);
      res.status(500).send("error");
   }
});

module.exports = router;
