const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth");

router.get("/google", authController.googleRedirect);
router.get("/google/callback", authController.googleCallback);
router.get("/me", authMiddleware, authController.getMe);
router.post("/google/verify", authController.verifyToken);

module.exports = router;
