/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: SCB PromptPay Logic (Frontend-based)
 * PATH: /root/narong69za.github.io/routes/scb.route.js
 * CREATED: 2026-04-13 | VERSION: v1.0.1
 * DESCRIPTION: รับคำสั่งเจน QR และส่งกลับเป็น Base64 โดยตรง
 */

const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { amount, email } = req.body;
    try {
        // [LOGIC]: ดึงข้อมูลจากฐานข้อมูลกลางมาเช็ค (ถ้าจำเป็น)
        // หรือส่งคำสั่งเจน QR ผ่าน Provider
        console.log(`[SCB] Requesting ${amount} for ${email}`);
        
        // จำลองการส่ง QR Base64 (เหมือนที่พี่ curl ผ่าน)
        res.json({ 
            success: true, 
            qrImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...", 
            txId: "TX_" + Date.now() 
        });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

module.exports = router;
