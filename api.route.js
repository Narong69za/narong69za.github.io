const express = require('express');
const router = express.Router();

const { verifyGoogle } = require("../services/auth.service");
const { runAI, runAI_DEBUG } = require("../services/ai.service");


// =============================
// BASIC TEST
// =============================
router.post('/generate',(req,res)=>{
   res.json({status:'AI READY'});
});


// =============================
// USAGE CHECK ENGINE
// =============================
const usageStore = {};

router.post("/usage-check",(req,res)=>{

   const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress;

   if(!usageStore[ip]) usageStore[ip]=0;

   usageStore[ip]++;

   if(usageStore[ip] > 3){
      return res.json({limit:true});
   }

   res.json({
      limit:false,
      remaining:3-usageStore[ip]
   });
});


// =============================
// AUTH CHECK REAL
// =============================
router.post("/auth-check",async(req,res)=>{

   try{

      const {token}=req.body;

      const user = await verifyGoogle(token);

      const key = user.email;

      if(!usageStore[key]) usageStore[key]=0;

      usageStore[key]++;

      if(usageStore[key] > 3){
         return res.json({limit:true});
      }

      res.json({
         ok:true,
         user,
         remaining:3-usageStore[key]
      });

   }catch(e){

      res.status(401).json({error:"AUTH FAILED"});

   }

});


// =============================
// REAL RENDER ENGINE
// =============================
router.post("/render",async(req,res)=>{

   try{

      const {template,input}=req.body;

      const MODEL_MAP = {
         "dark-viral":"owner/model1",
         "ai-lipsync":"owner/model2",
         "dance-motion":"
