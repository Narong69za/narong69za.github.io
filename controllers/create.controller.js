const MODEL_ROUTER = require("../models/model.router.js");

exports.create = async (req,res)=>{

   try{

      const {engine,alias,type,prompt} = req.body;

      const files = {};

      if(req.files){
         req.files.forEach(f=>{
            files[f.fieldname] = f;
         });
      }

      const result = await MODEL_ROUTER.run({
         engine,
         alias,
         type,
         prompt,
         files
      });

      res.json({
         status:"queued",
         data:result
      });

   }catch(err){

      console.error(err);

      res.status(500).json({
         error:true,
         message:err.message
      });

   }

};
