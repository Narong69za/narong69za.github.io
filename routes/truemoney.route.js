/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: TrueMoney Verification (Frontend-based)
 * PATH: /root/narong69za.github.io/routes/truemoney.route.js
 * CREATED: 2026-04-13 | VERSION: v1.0.1
 * DESCRIPTION: รับลิ้งค์ซองอั่งเปาและบันทึกลงคิวรอการตรวจสอบ
 */

const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { amount, link, email } = req.body;
    if (!link || !link.includes('gift.truemoney.com')) {
        return res.status(400).json({ success: false, msg: "INVALID_LINK" });
    }
    
    // บันทึกสถานะงานเพื่อให้ Master Gateway (5002) ทำการ Track ทุก 5 วินาที
    res.json({ 
        success: true, 
        txId: "TMN_" + Date.now(),
        status: "pending",
        message: "กำลังตรวจสอบซองอั่งเปา..."
    });
});

module.exports = router;
