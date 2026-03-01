/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: routes/omise.route.js
 * VERSION: v2.3.0
 * STATUS: production
 * LAST FIX: require auth middleware to fix req.user undefined
 */

const express = require("express");
const router = express.Router();
const Omise = require("omise");

const { addCredit } = require("../db/db");

// 🔥 IMPORT AUTH MIDDLEWARE (ใช้ของที่คุณมีอยู่แล้ว)
const requireAuth = require("../middlewares/auth.middleware");

const omise = Omise({
  secretKey: process.env.OMISE_SECRET_KEY
});

// =====================================================
// CREATE CHARGE (AUTH REQUIRED)
// =====================================================
router.post("/create-charge", requireAuth, async (req, res) => {

  try {

    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const { token, product } = req.body;

    if (!token) {
      return res.status(400).json({ error: "NO_TOKEN" });
    }

    const amount = 9900;
    const creditAmount = 100;

    const charge = await omise.charges.create({
      amount: amount,
      currency: "thb",
      card: token
    });

    console.log("CHARGE STATUS:", charge.status);

    if (charge.status === "successful") {

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
