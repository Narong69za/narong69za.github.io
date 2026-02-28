const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const jwtMiddleware = require('../middleware/jwt.middleware');

// OAuth Entry
router.get('/google', authController.googleRedirect);

// OAuth Callback
router.get('/google/callback', authController.googleCallback);

// Protected Test Route
router.get('/me', jwtMiddleware.verifyAccessToken, authController.me);

// Logout
router.get('/logout', authController.logout);
router.post('/logout', authController.logout);

module.exports = router;
