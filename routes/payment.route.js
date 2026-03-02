/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: routes/payment.route.js
 * VERSION: v9.0.1
 * STATUS: production
 * LAST FIX: full unified enterprise route with validation & structured response
 * =====================================================
 */

const express = require("express");
const router = express.Router();

const paymentService = require("../services/payment.service");
const config = require("../config/payment.config");

/**
 * POST /api/payment/create
 *
 * Body:
 * {
 *   method: "omise" | "truemoney" | "scb" | "crypto",
 *   product: "credit_pack_1"
 * }
 */

router.post("/create", async (req, res) => {

  try {

    /* ===============================
       1️⃣ AUTH VALIDATION
    =============================== */

    const user = req.user || req.session?.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "UNAUTHORIZED_USER"
      });
    }

    /* ===============================
       2️⃣ INPUT VALIDATION
    =============================== */

    const { method, product } = req.body;

    if (!method) {
      return res.status(400).json({
        success: false,
        error: "MISSING_PAYMENT_METHOD"
      });
    }

    if (!product) {
      return res.status(400).json({
        success: false,
        error: "MISSING_PRODUCT"
      });
    }

    if (!config.PRODUCTS[product]) {
      return res.status(400).json({
        success: false,
        error: "INVALID_PRODUCT"
      });
    }

    /* ===============================
       3️⃣ METHOD ENABLE CHECK
    =============================== */

    const methodEnabledMap = {
      omise: config.OMISE.ENABLED,
      truemoney: config.OMISE.ENABLED,
      scb: config.SCB.ENABLED,
      crypto: config.CRYPTO.ENABLED
    };

    if (!methodEnabledMap[method]) {
      return res.status(400).json({
        success: false,
        error: "PAYMENT_METHOD_DISABLED"
      });
    }

    /* ===============================
       4️⃣ EXECUTE SERVICE LAYER
    =============================== */

    const result = await paymentService.createPayment(
      method,
      product,
      user
    );

    /* ===============================
       5️⃣ STRUCTURED RESPONSE
    =============================== */

    return res.status(200).json({
      success: true,
      environment: config.ENV,
      method,
      product,
      data: result
    });

  } catch (err) {

    console.error("PAYMENT_ENGINE_V9_ERROR:", err.message);

    return res.status(500).json({
      success: false,
      error: err.message || "PAYMENT_ENGINE_INTERNAL_ERROR"
    });

  }

});

module.exports = router;
