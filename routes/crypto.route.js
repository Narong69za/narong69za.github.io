// =====================================================
// PROJECT: SN DESIGN ENGINE AI
// MODULE: routes/crypto.route.js
// VERSION: v1.0.0
// STATUS: production
// LAST FIX: initial create-order + webhook route
// =====================================================

const express = require("express");
const router = express.Router();

const cryptoController = require("../controllers/crypto.controller");

// 🔒 CREATE ORDER (JWT protected via server)
router.post("/create-order", cryptoController.createOrder);

// 🔓 WEBHOOK (NO AUTH)
router.post("/webhook", cryptoController.webhook);

module.exports = router;
