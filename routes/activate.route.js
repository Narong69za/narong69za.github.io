/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: routes/activate.route.js
 * VERSION: 1.0.0
 * STATUS: ACTIVE
 * LAST FIX: Initial activation route
 * =====================================================
 */

const express = require("express");
const router = express.Router();

const activateController = require("../controllers/activate.controller");

/**
 * Activate License
 * POST /api/activate
 */
router.post("/activate", activateController.activateLicense);

/**
 * Generate FREE Key
 * POST /api/generate-free-key
 */
router.post("/generate-free-key", activateController.generateFreeKey);

/**
 * Check License Status
 * GET /api/license-status
 */
router.get("/license-status", activateController.checkLicenseStatus);

module.exports = router;
