// ======================================================
// STRIPE WEBHOOK
// ======================================================

const express = require("express");
const router = express.Router();

const stripeService = require("../services/stripe.service");
const db = require("../db/db"); // ใช้ sqlite ของคุณ

router.post("/", async (req,res)=>{

  const sig = req.headers["stripe-signature"];

  let event;

  try{

    event = stripeService.constructWebhookEvent(
      req.body,
      sig
    );

  }catch(err){

    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);

  }

  if(event.type === "checkout.session.completed"){

    const session = event.data.object;

    const userId = session.metadata.userId;
    const credits = parseInt(session.metadata.credits);

    console.log("Payment Success:", userId, credits);

    // เติมเครดิตเข้า DB
    db.run(
      "UPDATE users SET credits = credits + ? WHERE id = ?",
      [credits, userId]
    );

  }

  res.json({ received: true });

});

module.exports = router;
