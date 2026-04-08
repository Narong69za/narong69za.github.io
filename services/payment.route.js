// ==============================
// SN DESIGN STUDIO PAYMENT ENGINE
// XENDIT QR AUTO SYSTEM
// ==============================

require("dotenv").config();

const express = require("express");
const router = express.Router();

const Xendit = require("xendit-node");

const x = new Xendit({
   secretKey: process.env.XENDIT_SECRET
});

const { QrCode } = x;

const qr = new QrCode();


// ==============================
// CREATE PAYMENT QR
// ==============================

router.post("/create", async (req,res)=>{

   try{

      const { amount, user } = req.body;

      // DEV MODE (ไม่ตัดเงินจริง)
      if(process.env.DEV_MODE === "true"){

         return res.json({
            dev:true,
            qr_string:"https://dummyimage.com/300x300/000/fff&text=DEV+QR"
         });

      }

      const qrCode = await qr.createQRCode({

         externalID:"sn-"+Date.now(),

         type:"DYNAMIC",

         callbackURL:"https://api.sn-designstudio.dev/api/webhook/xendit",

         amount: amount

      });

      res.json(qrCode);

   }catch(e){

      console.error(e);

      res.json({success:false});

   }

});

module.exports = router;
