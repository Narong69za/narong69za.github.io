// =====================================================
// SN DESIGN ENGINE AI
// ADMIN ROUTES — ULTRA CONTROL
// =====================================================

const express = require("express");
const router = express.Router();


// ===============================
// ADMIN AUTH CHECK
// ===============================

function adminAuth(req,res,next){

   const key = req.headers["x-admin-key"];

   if(!key || key !== process.env.ADMIN_SECRET){

      return res.status(403).json({
         error:"Unauthorized"
      });

   }

   next();
}


// ===============================
// ADMIN STATUS TEST
// ===============================

router.get("/status", adminAuth, (req,res)=>{

   res.json({
      admin:true,
      message:"ADMIN ACCESS OK"
   });

});


// ===============================
// EXPORT
// ===============================

module.exports = router;
