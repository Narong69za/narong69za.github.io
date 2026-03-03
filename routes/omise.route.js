// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: routes/omise.route.js
// VERSION: v9.0.0
// STATUS: production-final
// LAYER: gateway
// RESPONSIBILITY:
// - create omise charge
// - calculate credit via centralized policy
// - attach metadata (userId, credits)
// DEPENDS ON:
// - config/system.config.js
// - config/credit.policy.js
// - db/db.js
// LAST FIX:
// - unified credit calculation via credit.policy
// =====================================================

const express = require("express");
const Omise = require("omise");
const router = express.Router();

const config = require("../config/system.config");
const CREDIT_POLICY = require("../config/credit.policy");

const omise = Omise({
  publicKey: config.OMISE_PUBLIC_KEY,
  secretKey: config.OMISE_SECRET_KEY
});

// =====================================================
// CREATE CHARGE
// =====================================================

router.post("/create-charge", async (req, res) => {

  try {

    const userId = req.user?.id;
    const { amountTHB, token } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    if (!amountTHB || amountTHB < CREDIT_POLICY.MIN_TOPUP_THB) {
      return res.status(400).json({ error: "MIN_TOPUP_NOT_REACHED" });
    }

    if (!token) {
      return res.status(400).json({ error: "TOKEN_REQUIRED" });
    }

    // ===============================
    // 🔥 CENTRAL CREDIT CALCULATION
    // ===============================

    const creditResult =
      CREDIT_POLICY.calculateCreditFromTHB(amountTHB);

    const totalCredit = creditResult.totalCredit;

    // Omise ใช้หน่วยเป็น satang
    const amountSatang = amountTHB * 100;

    const charge = await omise.charges.create({
      amount: amountSatang,
      currency: "thb",
      card: token,
      metadata: {
        userId,
        credits: totalCredit
      }
    });

    return res.json({
      success: true,
      chargeId: charge.id,
      creditPreview: creditResult
    });

  } catch (err) {

    console.error("OMISE CREATE ERROR:", err);

    return res.status(500).json({
      error: "OMISE_CREATE_FAILED"
    });

  }

});

module.exports = router;
