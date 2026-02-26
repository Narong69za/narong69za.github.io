const express = require("express");
const router = express.Router();

const thaiQR = require("../services/thaiqr.service");
const trueMoney = require("../services/truemoney.service");

// ======================================================
// CREATE THAI PAYMENT
// ======================================================

router.post("/create", async (req,res)=>{

   const { method, amount, userId } = req.body;

   try{

      if(method==="promptpay"){

         const qr = await thaiQR.createPromptPayQR({
            amount,
            userId
         });

         return res.json(qr);

      }

      if(method==="truemoney"){

         const pay = await trueMoney.createTrueMoneyPayment({
            amount,
            userId
         });

         return res.json(pay);

      }

      res.status(400).json({error:"invalid method"});

   }catch(err){

      res.status(500).json({error:err.message});

   }

});

module.exports = router;
