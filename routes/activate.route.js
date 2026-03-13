/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: routes/activate.route.js
 * VERSION: 1.0.0
 * =====================================================
 */

const router = require('express').Router()
const ctrl = require('../controllers/activate.controller')

router.post('/generate',ctrl.generateKey)

module.exports = router
