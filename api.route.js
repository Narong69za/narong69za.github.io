const express = require("express");
const router = express.Router();

// ==============================
// SERVICES IMPORT (FIX PATH)
// ==============================

const { verifyGoogle } = require("../services/auth.service");
const { runAI, runAI_DEBUG } = require("../services/ai.service");


// ==============================
// MEMORY STORE
// ==============================

const usageStore = {};


// ==============================
// AI READY TEST
// ==============================

router.post("/generate",(req,res)=>{
   res.json({ status:"AI READY" });
});


// ==============================
// FREE USAGE LIMIT (IP BASE)
// ==============================

router.post("/usage-check",(req,res)=>{

   const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress;

   if(!usageStore[ip]) usageStore[ip]=0;

   usageStore[ip]++;

   if(usageStore[ip] > 3){
      return res.json({ limit:true });
   }

   res.json({
      limit:false,
      remaining:3-usageStore[ip]
   });

});


// ==============================
// GOOGLE AUTH CHECK
// ==============================

router.post("/auth-check", async(req,res)=>{

   try{

      const { token } = req.body;

      const user = await verifyGoogle(token);

      const key = user.email;

      if(!usageStore[key]) usageStore[key]=0;

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


// ==============================
// REAL RENDER ENGINE
// ==============================

router.post("/render", async(req,res)=>{

   try{

      const { template,input } = req.body;

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

      console.error("RENDER ERROR:",err);

      res.status(500).json({
         success:false
      });

   }

});


// ==============================
// DEBUG ROUTE
// ==============================

router.post("/render-debug", async(req,res)=>{

   try{

      const { template,input } = req.body;

      const MODEL_MAP = {

         "dark-viral":"owner/model1",
         "ai-lipsync":"owner/model2",
         "dance-motion":"owner/model3",
         "face-swap":"owner/model4"

      };

      const model = MODEL_MAP[template];

      const output = await runAI_DEBUG(model,input);

      res.json({
         debug:true,
         output
      });

   }catch(e){

      res.status(500).json({
         debug:true,
         error:e.message
      });

   }

});


// ==============================
// AUTO JOB QUEUE
// ==============================

router.post("/render-auto", async(req,res)=>{

   try{

      const { model,input } = req.body;

      const jobId = global.SN_CREATE_JOB({ model,input });

      setTimeout(()=>{

         global.SN_UPDATE_JOB(jobId,{
            status:"done",
            output:"mock-output.mp4"
         });

      },5000);

      res.json({
         success:true,
         jobId
      });

   }catch(err){

      res.status(500).json({ error:err.message });

   }

});


router.get("/job/:id",(req,res)=>{

   const job = global.SN_QUEUE.get(req.params.id);

   if(!job){
      return res.status(404).json({error:"not found"});
   }

   res.json(job);

});


module.exports = router;
