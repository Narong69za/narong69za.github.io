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

    /* ===============================
   SCB QR (ADD ONLY)
=============================== */

if(method === "scb"){

  if(req.body.amount < 50){
    return res.status(400).json({
      success:false,
      error:"MINIMUM_50_THB"
    });
  }

  const qrImage =
    "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=SCB-" + req.body.amount;

  db.sqlite.run(
    `INSERT INTO payment_logs
     (id,user_id,method,amount,currency,status,tx_id)
     VALUES (?,?,?,?,?,?,?)`,
    [
      require("uuid").v4(),
      user.id,
      "scb",
      req.body.amount,
      "THB",
      "pending",
      null
    ]
  );

  return res.json({
    success:true,
    qrImage
  });
}

/* ===============================
   CRYPTO CLEAN (LINK MODE)
=============================== */

if(method === "crypto"){

  const paymentUrl =
    "https://pay.binance.com/en/checkout/" +
    require("uuid").v4();

  db.sqlite.run(
    `INSERT INTO payment_logs
     (id,user_id,method,amount,currency,status,tx_id)
     VALUES (?,?,?,?,?,?,?)`,
    [
      require("uuid").v4(),
      user.id,
      "crypto",
      req.body.amount,
      "USD",
      "pending",
      null
    ]
  );

  return res.json({
    success:true,
    paymentUrl
  });
}
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
