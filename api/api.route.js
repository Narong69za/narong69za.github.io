const express = require("express");
const router = express.Router();

const auth = require('../services/auth.service');
const credit = require("../credit.service");
const usage = require("../usage-engine");
const ai = require("../ai.service");


/* ===================================
AI READY TEST
=================================== */

router.post("/generate",(req,res)=>{

   res.json({
      status:"AI READY"
   });

});


/* ===================================
ULTRA FINAL RENDER ENGINE
=================================== */

router.post("/render", async (req,res)=>{

   try{

      const user = await auth.check(req);

      /* ===============================
      DEV MODE BYPASS
      =============================== */

      if(!user.dev){

         const allowed = await usage.checkDailyFree(user.id);

         if(!allowed){

            const creditOK = await credit.consume(user.id);

            if(!creditOK){

               return res.status(403).json({
                  error:"NO CREDIT"
               });

            }

         }

      }

      const jobId = global.SN_CREATE_JOB(req.body);

      /* simulate async render */

      setTimeout(()=>{

         global.SN_UPDATE_JOB(jobId,{
            status:"done",
            output:"AI_VIDEO_READY"
         });

      },5000);

      res.json({
         jobId
      });

   }catch(e){

      res.status(401).json({
         error:"AUTH REQUIRED"
      });

   }

});


/* ===================================
JOB STATUS WATCH
=================================== */

router.get("/job/:id",(req,res)=>{

   const job = global.SN_QUEUE.get(req.params.id);

   res.json(job || {status:"not_found"});

});

module.exports = router;
