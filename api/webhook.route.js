// ==============================
// PAYMENT WEBHOOK
// ==============================

const express = require("express");
const router = express.Router();
const db = require("../db/db");


router.post("/xendit", async (req,res)=>{

   try{

      const data = req.body;

      const externalID = data.external_id;
      const status = data.status;

      if(status !== "COMPLETED"){
         return res.json({ok:true});
      }

      // check payment exist
      const payment = await db.get(
        "SELECT * FROM payments WHERE externalID=?",
        [externalID]
      );

      if(!payment) return res.json({ok:true});

      // prevent duplicate credit
      if(payment.status === "COMPLETED"){
         return res.json({duplicate:true});
      }

      // update payment status
      await db.run(
        "UPDATE payments SET status='COMPLETED' WHERE externalID=?",
        [externalID]
      );

      // add credit to user
      await db.run(
        "UPDATE users SET credit = credit + ? WHERE id=?",
        [payment.amount, payment.userID]
      );

      res.json({success:true});

   }catch(e){

      console.error(e);
      res.status(500).json({success:false});

   }

});

module.exports = router;
