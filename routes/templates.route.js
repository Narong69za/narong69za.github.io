const express = require("express");
const router = express.Router();

/*
=====================================
LOAD PRESETS
=====================================
*/

const presets = require("../services/preset.loader");

console.log("PRESETS ROUTE DATA:", presets);

/*
=====================================
GET ALL PRESETS
=====================================
*/

router.get("/", (req,res)=>{

   if(!presets){
      return res.status(500).json({
         error:"PRESET LOAD FAIL"
      });
   }

   res.json(presets);

});

/*
=====================================
GET SINGLE PRESET
=====================================
*/

router.get("/:slug",(req,res)=>{

   const preset = presets[req.params.slug];

   if(!preset){
      return res.status(404).json({
         error:"preset not found"
      });
   }

   res.json(preset);

});

module.exports = router;
