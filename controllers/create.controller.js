// create.controller.js

const router = require("../model.router");

exports.create = async (req,res)=>{

   try{

      const job = {

         engine: req.body.engine,
         alias: req.body.alias,
         type: req.body.type,
         prompt: req.body.prompt,
         files: req.files || {},
         jobID: Date.now()

      };

      const result = await router.run(job);

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
