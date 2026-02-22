const MODEL_ROUTER = require("../services/model.router");

async function create(req,res){

   try{

      const file = req.file;

      const alias = req.body.alias;
      const platform = req.body.platform;

      if(!alias){

         throw new Error("ALIAS NOT FOUND FROM CONTROLLER");

      }

      const result = await MODEL_ROUTER.run(
         alias,
         platform,
         {
            prompt:req.body.prompt || "",
            file:file
         }
      );

      res.json({
         success:true,
         result
      });

   }catch(err){

      console.log(err);

      res.status(500).json({
         success:false,
         error:err.message
      });

   }

}

module.exports = { create };
