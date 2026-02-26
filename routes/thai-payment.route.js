// =====================================================
// THAI PAYMENT ROUTE (PROMPTPAY + TRUEMONEY)
// =====================================================

const express = require("express");
const router = express.Router();

const generatePayload = require("promptpay-qr");
const QRCode = require("qrcode");


// =====================================================
// PROMPTPAY QR
// =====================================================

router.post("/promptpay", async (req,res)=>{

   try{

      const { amount } = req.body;

      const mobileNumber = process.env.PROMPTPAY_NUMBER;

      const payload = generatePayload(mobileNumber, {
         amount: amount
      });

      const qrImage = await QRCode.toDataURL(payload);

      res.json({
         success:true,
         qr: qrImage
      });

   }catch(err){

      console.error(err);

      res.status(500).json({
         error:"PROMPTPAY FAILED"
      });

   }

});


// =====================================================
// TRUEMONEY WALLET
// =====================================================

router.post("/truemoney", async (req,res)=>{

   try{

      const { amount } = req.body;

      // simple redirect link (test phase)
      const link = `https://wallet.truemoney.com/pay?amount=${amount}`;

      res.json({
         success:true,
         url: link
      });

   }catch(err){

      console.error(err);

      res.status(500).json({
         error:"TRUEMONEY FAILED"
      });

   }

});


module.exports = router;
