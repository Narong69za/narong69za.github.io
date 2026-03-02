// =====================================================
// PROJECT: SN DESIGN ENGINE AI
// MODULE: routes/crypto.route.js
// VERSION: v1.0.0
// STATUS: initial
// =====================================================

const express = require("express");
const router = express.Router();

// test endpoint
router.get("/test",(req,res)=>{
    res.json({status:"crypto route ready"});
});

module.exports = router;
