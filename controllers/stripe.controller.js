const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createCheckout = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.json({ error: "NO_AMOUNT" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "thb",
          product_data: { 
            name: "SN DESIGN CREDIT",
            description: "Enterprise AI Credit Pack"
          },
          unit_amount: amount * 100, // Stripe ใช้หน่วยสตางค์
        },
        quantity: 1,
      }],
      mode: "payment",
      // หลังจ่ายเสร็จให้เด้งกลับมาหน้าเว็บพี่
      success_url: "https://sn-designstudio.dev/payment.html?status=success",
      cancel_url: "https://sn-designstudio.dev/payment.html?status=cancel",
    });

    res.json({ success: true, url: session.url });
  } catch (err) {
    console.error("STRIPE_ERROR:", err.message);
    res.json({ error: "STRIPE_SESSION_FAIL" });
  }
};
