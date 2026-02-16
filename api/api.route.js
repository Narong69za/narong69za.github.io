const express = require("express");
const router = express.Router();

/*
================================
IMPORT SERVICES
================================
*/

const { verifyGoogle } = require("../services/auth.service");
const { runAI } = require("../services/ai.service");

/*
================================
MEMORY STORE
================================
*/

const usageStore = {};

/*
================================
TEST ROUTE
================================
*/

router.post("/generate",(req,res)=>{
   res.json({status:"AI READY"});
});

/*
================================
USAGE LIMIT CHECK
================================
*/

router.post("/usage-check",(req,res)=>{

   const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress;

   if(!usageStore[ip]){
      usageStore[ip]=0;
   }

   usageStore[ip]++;

   if(usageStore[ip] > 3){

      return res.json({ limit:true });

   }

   res.json({
      limit:false,
      remaining:3-usageStore[ip]
   });

});

/*
================================
AUTH CHECK
================================
*/

router.post("/auth-check", async (req,res)=>{

   try{

      const { token } = req.body;

      const user = await verifyGoogle(token);

      const key = user.email;

      if(!usageStore[key]){
         usageStore[key]=0;
      }

      usageStore[key]++;

      if(usageStore[key] > 3){
         return res.json({ limit:true });
      }

      res.json({
         ok:true,
         user:user,
         remaining:3-usageStore[key]
      });

   }catch(err){

      res.status(401).json({error:"AUTH FAILED"});

   }

});

/*
================================
AI RENDER ENGINE
================================
*/

router.post("/render", async (req,res)=>{

   try{

      const { template, input } = req.body;

      const MODEL_MAP = {

         "dark-viral":"owner/model1",
         "ai-lipsync":"owner/model2",
         "dance-motion":"owner/model3",
         "face-swap":"owner/model4"

      };

      const model = MODEL_MAP[template];

      if(!model){
         return res.status(400).json({error:"INVALID TEMPLATE"});
      }

      const output = await runAI(model,input);

      res.json({
         success:true,
         output
      });

   }catch(err){

      console.error("SN DESIGN RENDER ERROR:",err);

      res.status(500).json({
         success:false
      });

   }

});

module.exports = router;
