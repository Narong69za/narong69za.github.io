/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: routes/omise.route.js
 * VERSION: v2.4.0
 * STATUS: production
 * LAST FIX: remove auth middleware, use x-user-id header (match project structure)
 */

const express = require("express");
const router = express.Router();
const Omise = require("omise");
const db = require("../db/db");

const omise = Omise({
  secretKey: process.env.OMISE_SECRET_KEY
});

// =====================================================
// CREATE CHARGE
// =====================================================
router.post("/create-charge", async (req, res) => {

  try {

    console.log("BODY:", req.body);

    const userId = req.headers["x-user-id"];

    console.log("USER ID:", userId);

    if (!userId) {
      return res.status(400).json({ error: "NO_USER_ID" });
    }

    const { token, product } = req.body;

    if (!token) {
      return res.status(400).json({ error: "NO_TOKEN" });
    }

    // คุณปรับตาม product ได้เอง
    const amount = 9900;
    const creditAmount = 100;

    const charge = await omise.charges.create({
      amount: amount,
      currency: "thb",
      card: token
    });

    console.log("CHARGE STATUS:", charge.status);

    if (charge.status === "successful") {

      await db.addCredit(userId, creditAmount);

      return res.json({
        success: true,
        credit_added: creditAmount
      });
    }

    return res.json({ success: false });

  } catch (err) {

    console.error("OMISE CREATE ERROR:", err);
    return res.status(500).json({ error: "OMISE_FAIL" });
  }
});

module.exports = router;
