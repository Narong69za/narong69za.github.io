const express = require('express');
const router = express.Router();

router.post('/generate', (req, res) => {
  res.json({ status: 'AI READY' });
});

module.exports = router;

// =============================
// USAGE CHECK ENGINE (ADD ONLY)
// =============================

const usageStore = {};

router.post("/usage-check",(req,res)=>{

   const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress;

   if(!usageStore[ip]){
      usageStore[ip] = 0;
   }

   usageStore[ip]++;

   if(usageStore[ip] > 3){

      return res.json({
         limit:true
      });

   }

   res.json({
      limit:false,
      remaining: 3 - usageStore[ip]
   });

});
// =============================
// AUTH CHECK REAL
// =============================

const { verifyGoogle } = require("./auth.service");

const usageStore = {};

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

   }catch(e){

      res.status(401).json({ error:"AUTH FAILED" });

   }

});

// ADD ONLY - REAL RENDER ROUTE
const { runAI } = require("./ai.service");

router.post("/render", async (req,res)=>{

   try{

      const { template, input } = req.body;

      const modelMap = {
         "dark-viral":"owner/model1",
         "ai-lipsync":"owner/model2",
         "dance-motion":"owner/model3",
         "face-swap":"owner/model4"
      };

      const model = modelMap[template];

      if(!model){
         return res.status(400).json({error:"INVALID TEMPLATE"});
      }

      const output = await runAI(model,input);

      res.json({
         success:true,
         output
      });

   }catch(e){

      console.error(e);
      res.status(500).json({success:false});

   }

});
// ==============================
// SN DESIGN ADD ONLY : REAL RENDER ENGINE ROUTE
// ==============================

const { runAI } = require("./ai.service");

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
// ======================================================
// SN DESIGN ADD ONLY : DEV DEBUG RENDER ROUTE
// ======================================================

const { runAI_DEBUG } = require("./ai.service");

router.post("/render-debug", async (req,res)=>{

   try{

      const { template, input } = req.body;

      console.log("DEBUG TEMPLATE:",template);

      const MODEL_MAP = {

         "dark-viral":"owner/model1",
         "ai-lipsync":"owner/model2",
         "dance-motion":"owner/model3",
         "face-swap":"owner/model4"

      };

      const model = MODEL_MAP[template];

      console.log("DEBUG MODEL:",model);

      const output = await runAI_DEBUG(model,input);

      res.json({
         debug:true,
         output
      });

   }catch(e){

      console.log("DEBUG ROUTE ERROR:",e);

      res.status(500).json({
         debug:true,
         error:e.message
      });

   }

});
