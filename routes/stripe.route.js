const express = require("express");
const router = express.Router();
// เรียก Stripe ตรงๆ โดยใช้ Secret Key จาก .env
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const CREDIT_POLICY = require("../config/credit.policy");

router.post("/create-checkout", async (req, res) => {
  try {
    const amountTHB = req.body.amount || req.body.amountTHB || 100;
    const userId = "USER_TEST_69";
    
    const creditResult = CREDIT_POLICY.calculateCreditFromTHB(amountTHB);
    const amountSatang = Math.round(amountTHB * 100);

    // สร้าง Session โดยตรง
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "thb",
          product_data: { 
            name: "SN Design Credit Topup",
            description: `เติมเครดิต AI (${creditResult.totalCredit} Credits)`
          },
          unit_amount: amountSatang, // ค่านี้แหละครับที่มันต้องการ
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: "https://sn-designstudio.dev/payment.html?status=success",
      cancel_url: "https://sn-designstudio.dev/payment.html?status=cancel",
      metadata: { userId, credits: creditResult.totalCredit }
    });

    return res.json({ success: true, url: session.url });

  } catch (err) {
    console.error("STRIPE ERROR:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
