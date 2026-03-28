// routes/payment.webhook.js

const express = require("express");
const db = require("../db/db");

const router = express.Router();

router.post("/webhook/payment", async (req,res)=>{

  const { userId, amount, secret } = req.body;

  if(secret !== process.env.PAYMENT_SECRET){
    return res.status(403).json({error:"Unauthorized"});
  }

  try{

    await db.updateCredit(userId,amount);
    await db.createTransaction(userId,amount,"topup");

    res.json({success:true});

  }catch(err){
    res.status(500).json({error:err.message});
  }

});

module.exports = router;
