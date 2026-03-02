/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: routes/omise.route.js
 * VERSION: v2.7.0
 * STATUS: production
 * LAST FIX: move credit logic to webhook only (live-ready flow)
 */

const express = require("express");
const router = express.Router();
const Omise = require("omise");

const omise = Omise({
  secretKey: process.env.OMISE_SECRET_KEY
});

// =====================================================
// PRODUCT MAP (LOCKED)
// =====================================================

const PRODUCT_MAP = {
  credit_pack_1: {
    amount: 9900,
    credits: 100
  }
};

// =====================================================
// CREATE CHARGE (CARD)
// =====================================================

router.post("/create-charge", async (req, res) => {

  try {

    const userId = req.user?.id || req.session?.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "UNAUTHORIZED_USER" });
    }

    const { token, product } = req.body;

    if (!token) {
      return res.status(400).json({ error: "NO_TOKEN" });
    }

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
        credits: selected.credits
      }
    });

    return res.json({
      success: true,
      chargeId: charge.id,
      status: charge.status
    });

  } catch (err) {

    console.error("OMISE CREATE ERROR:", err);
    return res.status(500).json({ error: "OMISE_FAIL" });
  }
});

// =====================================================
// CREATE TRUE MONEY WALLET
// =====================================================

router.post("/create-truewallet", async (req, res) => {

  try {

    const userId = req.user?.id || req.session?.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "UNAUTHORIZED_USER" });
    }

    const { product } = req.body;

    const selected = PRODUCT_MAP[product];

    if (!selected) {
      return res.status(400).json({ error: "INVALID_PRODUCT" });
    }

    const source = await omise.sources.create({
      type: "truemoney",
      amount: selected.amount,
      currency: "thb"
    });

    const charge = await omise.charges.create({
      amount: selected.amount,
      currency: "thb",
      source: source.id,
      metadata: {
        userId: userId,
        credits: selected.credits
      }
    });

    return res.json({
      authorizeUri: source.authorize_uri,
      chargeId: charge.id
    });

  } catch (err) {

    console.error("TRUEWALLET ERROR:", err);
    return res.status(500).json({ error: "TRUEWALLET_FAIL" });
  }
});

module.exports = router;
