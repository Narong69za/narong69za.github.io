// ==============================
// SN DESIGN STUDIO PAYMENT ENGINE
// ==============================

require("dotenv").config();

const express = require("express");
const router = express.Router();

const Xendit = require("xendit-node");

const db = require("../db/db");

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

      const { amount, userID } = req.body;

      if(!userID || !amount){
         return res.status(400).json({error:"invalid data"});
      }

      const externalID = `sn-${userID}-${Date.now()}`;

      // DEV MODE
      if(process.env.DEV_MODE === "true"){

         await db.run(
           "INSERT INTO payments(externalID,userID,amount,status) VALUES(?,?,?,?)",
           [externalID,userID,amount,"DEV_PENDING"]
         );

         return res.json({
            dev:true,
            qr_string:"https://dummyimage.com/300x300/000/fff&text=DEV+QR",
            externalID
         });

      }

      const qrCode = await qr.createQRCode({

         externalID,
         type:"DYNAMIC",
         callbackURL:process.env.WEBHOOK_URL,
         amount

      });

      await db.run(
        "INSERT INTO payments(externalID,userID,amount,status) VALUES(?,?,?,?)",
        [externalID,userID,amount,"PENDING"]
      );

      res.json(qrCode);

   }catch(e){

      console.error(e);
      res.status(500).json({success:false});

   }

});

module.exports = router;
