// src/controllers/create.controller.js

const MODEL_ROUTER = require("../services/model.router");

exports.create = async (req,res)=>{

   try{

      const payload = {

         engine: req.body.engine,
         alias: req.body.alias,
         type: req.body.type,
         prompt: req.body.prompt,
         files: req.files || {},
         jobID: Date.now()

      };

      const result = await MODEL_ROUTER.run(payload);

      res.json({
         status:"started",
         result
      });

   }catch(err){

      console.error(err);

      res.status(500).json({
         error: err.message
      });

   }

};
