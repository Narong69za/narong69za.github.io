const express = require('express');
const router = express.Router();

const { runAI } = require("../services/ai.service");
const { verifyGoogle } = require("../services/auth.service");

/* =============================
LIVE USER STORE
============================= */

if(!global.SN_ONLINE_USERS){

   global.SN_ONLINE_USERS = new Set();

}

/* =============================
BASIC STATUS
============================= */

router.post('/generate', (req, res) => {

  res.json({ status: 'AI READY' });

});

/* =============================
AUTH CHECK
============================= */

router.post("/auth-check", async (req,res)=>{

   try{

      const { token } = req.body;

      const user = await verifyGoogle(token);

      global.SN_ONLINE_USERS.add(user.email);

      res.json({
         ok:true,
         user:user
      });

   }catch(e){

      res.status(401).json({ error:"AUTH FAILED" });

   }

});

/* =============================
LIVE USERS API
============================= */

router.get("/live-users",(req,res)=>{

   res.json({
      online: global.SN_ONLINE_USERS.size
   });

});

/* =============================
RENDER ENGINE
============================= */

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

      console.log(err);

      res.status(500).json({

         success:false

      });

   }

});

module.exports = router;
