// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: routes/omise.route.js
// VERSION: v9.2.0
// STATUS: production-final
// LAYER: gateway
// RESPONSIBILITY:
// - create omise charge (card)
// - create truemoney source
// - calculate credit via credit.policy
// DEPENDS ON:
// - config/credit.policy.js
// - middleware/auth.js
// LAST FIX:
// - removed PRODUCT_MAP
// - unified credit calculation
// - policy-based metadata
// =====================================================

const express = require("express");
const router = express.Router();
const Omise = require("omise");

const CREDIT_POLICY = require("../config/credit.policy");

const omise = Omise({
  secretKey: process.env.OMISE_SECRET_KEY
});

// ===============================
// CREDIT CALCULATOR
// ===============================

function calculateCredits(thb) {

  const base = thb * CREDIT_POLICY.BASE_RATE;

  const tier = CREDIT_POLICY.BONUS_TIERS
    .filter(t => thb >= t.min)
    .sort((a,b)=>b.min-a.min)[0];

  if (!tier) return Math.floor(base);

  return Math.floor(base + (base * tier.bonusPercent / 100));
}

// =====================================================
// CREATE CARD CHARGE
// =====================================================

router.post("/create-charge", async (req, res) => {

  try {

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "UNAUTHORIZED_USER" });
    }

    const { token, amount } = req.body;

    if (!token || !amount) {
      return res.status(400).json({ error: "INVALID_REQUEST" });
    }

    const thb = Number(amount);

    if (thb < CREDIT_POLICY.MIN_TOPUP_THB) {
      return res.status(400).json({ error: "MIN_TOPUP_NOT_MET" });
    }

    const credits = calculateCredits(thb);

    const charge = await omise.charges.create({
      amount: thb * 100, // satang
      currency: "thb",
      card: token,
      metadata: {
        userId: userId,
        credits: credits
      }
    });

    return res.json({
      success: true,
      chargeId: charge.id,
      status: charge.status,
      credits
    });

  } catch (err) {

    console.error("OMISE CREATE ERROR:", err);
    return res.status(500).json({ error: "OMISE_FAIL" });

  }
});

// =====================================================
// CREATE TRUE MONEY
// =====================================================

router.post("/create-truewallet", async (req, res) => {

  try {

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "UNAUTHORIZED_USER" });
    }

    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "INVALID_REQUEST" });
    }

    const thb = Number(amount);

    if (thb < CREDIT_POLICY.MIN_TOPUP_THB) {
      return res.status(400).json({ error: "MIN_TOPUP_NOT_MET" });
    }

    const credits = calculateCredits(thb);

    const source = await omise.sources.create({
      type: "truemoney",
      amount: thb * 100,
      currency: "thb"
    });

    const charge = await omise.charges.create({
      amount: thb * 100,
      currency: "thb",
      source: source.id,
      metadata: {
        userId: userId,
        credits: credits
      }
    });

    return res.json({
      authorizeUri: source.authorize_uri,
      chargeId: charge.id,
      credits
    });

  } catch (err) {

    console.error("TRUEWALLET ERROR:", err);
    return res.status(500).json({ error: "TRUEWALLET_FAIL" });

  }
});

module.exports = router;
