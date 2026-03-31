const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const authMiddleware = require("../middleware/auth");
const CREDIT_POLICY = require("../config/credit.policy");

router.post("/create-checkout", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const amountTHB = req.body.amount || req.body.amountTHB;

    if (!amountTHB) return res.status(400).json({ error: "NO_AMOUNT" });

    const creditResult = CREDIT_POLICY.calculateCreditFromTHB(amountTHB);
    const amountSatang = Math.round(amountTHB * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "thb",
          product_data: { name: "SN Design Credit Topup" },
          unit_amount: amountSatang,
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: "https://sn-designstudio.dev/payment.html?status=success",
      cancel_url: "https://sn-designstudio.dev/payment.html?status=cancel",
      metadata: { userId: userId.toString(), credits: creditResult.totalCredit }
    });

    return res.json({ success: true, url: session.url });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
