const modelRouter = require("../models/model.router");

exports.create = async (req,res)=>{

   try{

      const { engine, alias, type, prompt } = req.body;

      const files={};

      if(req.files){

         req.files.forEach(f=>{
            files[f.fieldname]=f;
         });

      }

      const result = await modelRouter.run({
         engine,
         alias,
         type,
         prompt,
         files
      });

      res.json({
         status:"queued",
         result
      });

   }catch(err){

      console.error(err);

      res.status(500).json({
         error:err.message
      });

   }

};
