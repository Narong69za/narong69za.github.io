/*
=====================================
ULTRA TEMPLATE ROUTE
SN DESIGN STUDIO
=====================================
*/

const express = require("express");
const router = express.Router();

const presets = require("../services/preset.loader");

/*
=====================================
GET ALL PRESETS (CARD LIST)
=====================================
*/

router.get("/templates",(req,res)=>{

   const list = Object.keys(presets).map(id=>{

      const p = presets[id];

      return {
         id:p.id,
         engine:p.engine || p.id,
         provider:p.provider,
         creditCost:p.creditCost || 0,
         limits:p.limits || {},
         input:p.input || {}
      };

   });

   res.json(list);

});

/*
=====================================
GET SINGLE PRESET
=====================================
*/

router.get("/templates/:id",(req,res)=>{

   const preset = presets[req.params.id];

   if(!preset){

      return res.status(404).json({
         error:"PRESET NOT FOUND"
      });

   }

   res.json({
      id:preset.id,
      engine:preset.engine || preset.id,
      provider:preset.provider,
      creditCost:preset.creditCost || 0,
      limits:preset.limits || {},
      input:preset.input || {}
   });

});

module.exports = router;
