const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../db/db'); // ใช้ db.js ตัวที่เราอัปเกรด
const { calculateCreditFromTHB } = require('../config/credit.policy');

// 1. สร้าง Link จ่ายเงิน
router.post('/create-checkout-session', async (req, res) => {
    const { amountTHB } = req.body; // รับยอดเงินเป็นบาท (เช่น 100)
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'thb',
                product_data: { name: 'เติมเครดิต SN ULTRA' },
                unit_amount: amountTHB * 100, // Stripe คิดเป็นสตางค์
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: 'https://sn-designstudio.dev/success.html',
        cancel_url: 'https://sn-designstudio.dev/payment.html',
        metadata: { userId: req.user.id, amountTHB: amountTHB } // ฝาก ID ไว้เช็คตอนเงินเข้า
    });
    res.json({ url: session.url });
});

// 2. Webhook: รอรับสัญญาณเมื่อจ่ายสำเร็จ (ตัวนี้สำคัญ!)
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const event = req.body;
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata.userId;
        const amountTHB = parseInt(session.metadata.amountTHB);

        // คำนวณเครดิตตาม Option B (1 บาท = 10c + Bonus)
        const { totalCredit } = calculateCreditFromTHB(amountTHB);

        // ยัดเงินเข้า Database ทันที!
        await db.addCredit(userId, totalCredit);
        console.log(`💰 STRIPE SUCCESS: User ${userId} received ${totalCredit} credits`);
    }
    res.json({received: true});
});

module.exports = router;
