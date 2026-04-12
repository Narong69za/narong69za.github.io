const express = require("express");
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const dbPath = "/root/sn-payment-core/database.db";

router.post("/stripe", async (req, res) => {
    let event;
    try {
        // ✅ รับได้ทั้ง Object และ Raw String (กัน Error Unexpected token o)
        event = (typeof req.body === 'object') ? req.body : JSON.parse(req.body.toString());
    } catch (err) {
        return res.status(400).send("Format Error");
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata?.userId || "1";
        const credits = parseInt(session.metadata?.credits) || 0;
        const amount = session.amount_total / 100;

        const db = new sqlite3.Database(dbPath);
        db.serialize(() => {
            // บันทึกเงินจริงลงตาราง Payments (มีคอลัมน์ txId รองรับแล้ว)
            db.run("INSERT OR REPLACE INTO payments (txId, userId, amount, status, method) VALUES (?, ?, ?, 'success', 'stripe')", 
                   [session.id, userId, amount]);
            
            // เติมเครดิตเข้า User จริงๆ
            db.run("UPDATE users SET credits = credits + ? WHERE id = ?", [credits, userId]);
        });
        db.close();
        console.log(`✅ [PAYMENT] User ${userId} +${credits} Credits`);
    }
    res.json({ received: true });
});

module.exports = router;

