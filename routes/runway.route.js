/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: routes/runway.route.js
VERSION: v1.0.0
STATUS: production
RESPONSIBILITY:
- expose runway api endpoints
===================================================== */

const express = require("express")
const router = express.Router()

const runwayController = require("../controllers/runway.controller")

router.post("/upload", runwayController.upload)
router.post("/generate", runwayController.generate)
router.get("/task/:id", runwayController.task)

module.exports = router
