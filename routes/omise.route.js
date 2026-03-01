// ======================================================
// MODULE: omise.route.js
// VERSION: 1.0.0
// ======================================================

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { createCharge } = require("../services/omise.service");

router.post("/create", authMiddleware, async (req,res)=>{

  try{

    const { amount } = req.body;

    if(!amount){
      return res.status(400).json({ error:"NO_AMOUNT" });
    }

    const charge = await createCharge({
      amount: amount * 100, // satang
      returnUri: "https://sn-designstudio.dev/create.html",
      metadata: {
        userId: req.user.id,
        credits: amount
      }
    });

    res.json({ authorizeUri: charge.authorize_uri });

  }catch(err){
    console.error(err);
    res.status(500).json({ error:"OMISE_CREATE_FAILED" });
  }

});

module.exports = router;
