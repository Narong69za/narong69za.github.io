const express = require("express");
const router = express.Router();

const presets = require("../services/preset.loader");

/*
=====================================
GET ALL PRESETS
=====================================
*/
router.get("/", (req,res)=>{
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
