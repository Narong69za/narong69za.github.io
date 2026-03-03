// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: routes/crypto.route.js
// VERSION: v9.0.0
// STATUS: production-final
// LAYER: gateway
// RESPONSIBILITY:
// - create crypto order
// - calculate credit via policy (BNB → THB)
// - attach metadata (userId, credits)
// - register webhook (raw body)
// DEPENDS ON:
// - config/credit.policy.js
// - controllers/crypto.controller.js
// =====================================================

const express = require("express");
const router = express.Router();

const CREDIT_POLICY = require("../config/credit.policy");
const cryptoController = require("../controllers/crypto.controller");

// =====================================================
// CREATE ORDER (JWT Protected via server)
// =====================================================

router.post("/create-order", async (req, res) => {

  try {

    const userId = req.user?.id;
    const { amountBNB } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    if (!amountBNB || amountBNB <= 0) {
      return res.status(400).json({ error: "INVALID_BNB_AMOUNT" });
    }

    // 🔥 CENTRAL CREDIT CALCULATION
    const creditResult =
      CREDIT_POLICY.calculateCreditFromBNB(amountBNB);

    const totalCredit = creditResult.totalCredit;

    const order = await cryptoController.createOrder({
      userId,
      amountBNB,
      credits: totalCredit
    });

    return res.json({
      order,
      creditPreview: creditResult
    });

  } catch (err) {

    console.error("CRYPTO CREATE ERROR:", err);

    return res.status(500).json({
      error: "CRYPTO_CREATE_FAILED"
    });

  }

});

// =====================================================
// WEBHOOK (NO AUTH)
// =====================================================

router.post("/webhook", cryptoController.webhook);

module.exports = router;
