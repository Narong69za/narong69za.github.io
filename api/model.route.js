const express = require("express");
const router = express.Router();

const MODEL_ROUTER = require("../services/model.router");

/*
=====================================
GET ALL MODELS
=====================================
*/

router.get("/", (req,res)=>{

   const models = MODEL_ROUTER.getAll();

   res.json(models);

});

/*
=====================================
GET MODEL CONFIG + AUTO UI
=====================================
*/

router.get("/:id",(req,res)=>{

   const model = MODEL_ROUTER.getModel(req.params.id);

   if(!model){

      return res.status(404).json({
         error:"MODEL NOT FOUND"
      });

   }

   res.json(model);

});

module.exports = router;
