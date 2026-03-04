// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: routes/crypto.webhook.js
// VERSION: v9.0.0
// STATUS: production-final
// LAYER: gateway
// RESPONSIBILITY:
// - handle Binance Pay webhook (raw body)
// - delegate to crypto.controller
// =====================================================

const express = require("express");
const router = express.Router();

const cryptoController = require("../controllers/crypto.controller");

router.post("/", cryptoController.webhook);

module.exports = router;
