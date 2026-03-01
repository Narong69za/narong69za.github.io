/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: routes/omise.route.js
 * VERSION: v2.2.0
 * STATUS: production
 * LAST FIX: enforce token validation + debug logs + safe credit add
 */

const express = require("express");
const router = express.Router();
const Omise = require("omise");

const { addCredit } = require("../db/db");

const omise = Omise({
  secretKey: process.env.OMISE_SECRET_KEY
});

// =====================================================
// CREATE CHARGE (CARD TOKEN FLOW)
// =====================================================
router.post("/create-charge", async (req, res) => {

  try {

    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const { token, product } = req.body;

    if (!token) {
      return res.status(400).json({ error: "NO_TOKEN" });
    }

    // 🔥 ปรับราคาแพ็คเกจตรงนี้
    const amount = 9900; // 99.00 THB
    const creditAmount = 100;

    const charge = await omise.charges.create({
      amount: amount,
      currency: "thb",
      card: token
    });

    console.log("CHARGE STATUS:", charge.status);

    if (charge.status === "successful") {

      if (!req.user || !req.user.id) {
        return res.status(400).json({ error: "NO_USER_SESSION" });
      }

      await addCredit(req.user.id, creditAmount);

      return res.json({ success: true });
    }

    return res.json({ success: false });

  } catch (err) {

    console.error("OMISE CREATE ERROR:", err);
    return res.status(500).json({ error: "OMISE_FAIL" });
  }
});

module.exports = router;
