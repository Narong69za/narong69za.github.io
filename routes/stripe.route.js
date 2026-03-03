// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: routes/stripe.route.js
// VERSION: v9.0.0
// STATUS: production-final
// LAYER: gateway
// RESPONSIBILITY:
// - create stripe checkout session
// - calculate credit via centralized policy
// - attach metadata (userId, credits)
// DEPENDS ON:
// - config/credit.policy.js
// - services/stripe.service.js
// - middleware/auth.js
// LAST FIX:
// - removed hardcoded product map
// - unified credit calculation
// =====================================================

const express = require("express");
const router = express.Router();

const stripeService = require("../services/stripe.service");
const authMiddleware = require("../middleware/auth");
const CREDIT_POLICY = require("../config/credit.policy");

// =====================================================
// CREATE CHECKOUT SESSION
// =====================================================

router.post("/create-checkout", authMiddleware, async (req, res) => {

  try {

    const userId = req.user?.id;
    const { amountTHB } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    if (!amountTHB || amountTHB < CREDIT_POLICY.MIN_TOPUP_THB) {
      return res.status(400).json({ error: "MIN_TOPUP_NOT_REACHED" });
    }

    // ===============================
    // 🔥 CENTRAL CREDIT CALCULATION
    // ===============================

    const creditResult =
      CREDIT_POLICY.calculateCreditFromTHB(amountTHB);

    const totalCredit = creditResult.totalCredit;

    // Stripe ใช้หน่วยเป็น satang (เหมือน Omise)
    const amountSatang = amountTHB * 100;

    const session = await stripeService.createCheckout({
      name: "SN Design Credit Topup",
      amount: amountSatang,
      userId,
      credits: totalCredit
    });

    return res.json({
      url: session.url,
      creditPreview: creditResult
    });

  } catch (err) {

    console.error("STRIPE CREATE ERROR:", err);

    return res.status(500).json({
      error: "STRIPE_CREATE_FAILED"
    });

  }

});

module.exports = router;
