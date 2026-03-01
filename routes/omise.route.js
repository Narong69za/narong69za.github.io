/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: routes/omise.route.js
 * VERSION: v1.3.0
 * STATUS: production
 * LAST FIX: correct omise sdk initialization
 */

const express = require("express");
const router = express.Router();

// ✅ INIT SDK แบบถูกต้อง
const omise = require("omise")({
  publicKey: process.env.OMISE_PUBLIC_KEY,
  secretKey: process.env.OMISE_SECRET_KEY
});

console.log("OMISE KEY LOADED:", !!process.env.OMISE_SECRET_KEY);

// =====================================================
// CREATE CHARGE
// =====================================================

router.post("/create-charge", async (req, res) => {

  try {

    const { amount, token, packageName, userId } = req.body;

    if (!amount || !token || !packageName || !userId) {
      return res.status(400).json({ error: "missing required fields" });
    }

    const charge = await omise.charges.create({
      amount: parseInt(amount),
      currency: "thb",
      card: token,

      // 🔥 สำคัญมาก
      metadata: {
        userId: userId,
        package: packageName
      }

    });

    res.json({
      status: "created",
      charge
    });

  } catch (err) {

    console.error("OMISE CREATE ERROR:", err);
    res.status(500).json({ error: err.message });

  }

});

module.exports = router;
