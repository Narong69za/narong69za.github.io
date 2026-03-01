
/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: routes/omise.route.js
 * VERSION: v2.5.0
 * STATUS: production
 * LAST FIX: switch from x-user-id header to session-based auth (no structure change)
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

    // 🔥 ใช้ session / auth middleware ที่ระบบคุณมีอยู่แล้ว
    const userId = req.user?.id || req.session?.user?.id;

    console.log("USER ID:", userId);

    if (!userId) {
      return res.status(401).json({ error: "UNAUTHORIZED_USER" });
    }

    const { token, product } = req.body;

    if (!token) {
      return res.status(400).json({ error: "NO_TOKEN" });
    }

    // ============================
    // PRODUCT MAP
    // ============================
    const PRODUCT_MAP = {
      credit_pack_1: {
        amount: 9900,
        credits: 100
      }
    };

    const selected = PRODUCT_MAP[product];

    if (!selected) {
      return res.status(400).json({ error: "INVALID_PRODUCT" });
    }

    const charge = await omise.charges.create({
      amount: selected.amount,
      currency: "thb",
      card: token,
      metadata: {
        userId: userId,
        package: product
      }
    });

    console.log("CHARGE STATUS:", charge.status);

    if (charge.status === "successful") {

      await db.addCredit(userId, selected.credits);

      return res.json({
        success: true,
        credit_added: selected.credits
      });
    }

    return res.json({ success: false });

  } catch (err) {

    console.error("OMISE CREATE ERROR:", err);
    return res.status(500).json({ error: "OMISE_FAIL" });
  }
});

module.exports = router;
