const express = require("express");
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const dbPath = "/root/sn-payment-core/database.db";

router.post("/stripe", async (req, res) => {
    let event;
    try {
        // ✅ [FIXED]: ป้องกัน Error Unexpected token o โดยการเช็คประเภทข้อมูลก่อน Parse
        event = (typeof req.body === 'object') ? req.body : JSON.parse(req.body.toString());
    } catch (err) {
        console.error("⚠️ Webhook Parse Error:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata?.userId || "1";
        const credits = parseInt(session.metadata?.credits) || 0;
        const amount = session.amount_total / 100;
        const txId = session.id;

        const db = new sqlite3.Database(dbPath);
        db.serialize(() => {
            // บันทึกลงตาราง Payments (ตรวจสอบคอลัมน์ txId ให้พร้อม)
            db.run(`INSERT OR REPLACE INTO payments (txId, userId, amount, status, method, createdAt) 
                    VALUES (?, ?, ?, 'success', 'stripe', DATETIME('now'))`, 
                   [txId, userId, amount]);
            
            // เติมเครดิตให้ User จริง
            db.run("UPDATE users SET credits = credits + ? WHERE id = ?", [credits, userId]);
        });
        db.close();
        console.log(`✅ [PAYMENT SUCCESS] User: ${userId} | Amount: ${amount} | Credits: +${credits}`);
    }

    // ตอบกลับ Stripe เสมอเพื่อไม่ให้มันส่งซ้ำ
    res.json({ received: true });
});

module.exports = router;

