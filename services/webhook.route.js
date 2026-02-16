// ==============================
// SN DESIGN STUDIO WEBHOOK
// AUTO CREDIT SYSTEM
// ==============================

const express = require("express");
const router = express.Router();


// ตัวอย่าง storage (เปลี่ยน DB ทีหลัง)
const CREDIT_STORE = {};

router.post("/xendit",(req,res)=>{

   const data = req.body;

   if(data.status === "COMPLETED"){

      const user = data.external_id;

      if(!CREDIT_STORE[user]){
         CREDIT_STORE[user]=0;
      }

      CREDIT_STORE[user]+=1000;

      console.log("CREDIT ADDED:",user);

   }

   res.sendStatus(200);

});

module.exports = router;
