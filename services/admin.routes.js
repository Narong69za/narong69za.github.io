// =====================================================
// SN DESIGN ENGINE AI
// ADMIN CONTROL ULTRA
// =====================================================

const express = require("express");
const router = express.Router();
const db = require("../db/db");

// ===============================
// ADMIN AUTH SIMPLE GUARD
// ===============================

function adminGuard(req,res,next){

   const key = req.headers["x-admin-key"];

   if(key !== process.env.ADMIN_SECRET){

      return res.status(403).json({
         error:"Unauthorized"
      });

   }

   next();
}


// ===============================
// GET ALL USERS
// ===============================

router.get("/users", adminGuard, async (req,res)=>{

   const users = db._debugUsers();

   res.json(users);

});


// ===============================
// ADD CREDIT
// ===============================

router.post("/add-credit", adminGuard, async (req,res)=>{

   const { userId, amount } = req.body;

   if(!userId || !amount){

      return res.status(400).json({
         error:"Missing userId or amount"
      });

   }

   await db.addCredit(userId, parseInt(amount));

   res.json({
      success:true
   });

});


// ===============================
// FREE USAGE LOG
// ===============================

router.get("/free-usage", adminGuard, async (req,res)=>{

   const usage = db._debugFreeUsage();

   res.json(usage);

});


module.exports = router;
