const express = require("express");
const router = express.Router();

const presets = require("../services/preset.loader");

router.get("/", (req,res)=>{

   console.log("API HIT /api/templates");
   console.log("PRESETS VALUE:", presets);

   res.setHeader("Content-Type","application/json");

   res.send(JSON.stringify(presets));

});

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
