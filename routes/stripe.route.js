/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: Stripe Production Logic
 * PATH: /root/narong69za.github.io/routes/stripe.route.js
 * CREATED: 2026-04-13 | VERSION: v1.1.0
 * STATUS: PRODUCTION-FINAL
 * DESCRIPTION: สร้าง Stripe Checkout Session โดยเชื่อมโยงกับ Email ผู้ใช้งานจริง
 */

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/', async (req, res) => {
    const { amount, email } = req.body;
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'thb',
                    product_data: { name: 'SN ULTRA CREDIT TOPUP' },
                    unit_amount: amount * 100,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: "https://sn-designstudio.dev/create.html?status=success",
            cancel_url: "https://sn-designstudio.dev/payment.html?status=cancel",
            metadata: { email: email }
        });
        res.json({ success: true, url: session.url });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

module.exports = router;
