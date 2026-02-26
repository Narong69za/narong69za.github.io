// ======================================================
// STRIPE WEBHOOK - ULTRA SAFE VERSION
// ======================================================

const express = require("express");
const router = express.Router();

const stripeService = require("../services/stripe.service");
const db = require("../db/db");

// ======================================================
// STRIPE WEBHOOK
// ======================================================

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

  // ======================================================
  // CHECKOUT SUCCESS
  // ======================================================

  if(event.type === "checkout.session.completed"){

    const session = event.data.object;

    const userId = session?.metadata?.userId;
    const credits = parseInt(session?.metadata?.credits || 0);

    if(!userId || !credits){

      console.error("Invalid metadata in webhook");
      return res.json({ received:true });

    }

    console.log("💰 PAYMENT SUCCESS:", userId, credits);

    try{

      // ======================================================
      // ADD CREDIT SAFELY
      // ======================================================

      await db.addCredit(userId, credits);

      console.log("✅ CREDIT ADDED:", credits);

    }catch(err){

      console.error("DB CREDIT ERROR:", err);

    }

  }

  res.json({ received: true });

});

module.exports = router;
