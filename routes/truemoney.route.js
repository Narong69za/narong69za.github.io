const express = require("express");
const router = express.Router();
const tmController = require("../controllers/truemoney.controller");

router.post("/pay", tmController.processWallet);

module.exports = router;
