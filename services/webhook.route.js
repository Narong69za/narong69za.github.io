// ==============================
// SN DESIGN STUDIO WEBHOOK
// AUTO CREDIT SYSTEM (SAFE VERSION)
// ==============================

const express = require("express");
const router = express.Router();

/*
IMPORTANT:
ถ้าใช้ Xendit จริง ควรใช้ raw body + signature verification
ตอนนี้ทำเป็น SAFE JSON MODE ก่อน
*/

// ==============================
// TEMP MEMORY STORE (REPLACE WITH DB LATER)
// ==============================

const CREDIT_STORE = {};

// ==============================
// HEALTH CHECK (OPTIONAL DEBUG)
// ==============================

router.get("/health", (req, res) => {
   res.json({
      status: "webhook alive"
   });
});

// ==============================
// XENDIT WEBHOOK
// ==============================

router.post("/xendit", (req, res) => {

   try {

      const data = req.body;

      if (!data) {
         return res.status(400).json({
            error: "no payload"
         });
      }

      // Validate structure
      if (!data.external_id) {
         return res.status(400).json({
            error: "missing external_id"
         });
      }

      // Only process completed payment
      if (data.status === "COMPLETED") {

         const user = data.external_id;

         if (!CREDIT_STORE[user]) {
            CREDIT_STORE[user] = 0;
         }

         // Example logic: +1000 credit per completed payment
         CREDIT_STORE[user] += 1000;

         console.log("CREDIT ADDED:", user, "TOTAL:", CREDIT_STORE[user]);
      }

      return res.sendStatus(200);

   } catch (err) {

      console.error("WEBHOOK ERROR:", err);

      return res.sendStatus(500);
   }

});

module.exports = router;
