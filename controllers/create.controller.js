const MODEL_ROUTER = require("../services/model.router");

async function create(req,res){

   try{

      const result = await MODEL_ROUTER.run(
         req.body.alias,
         req.body.platform,
         {
            prompt:req.body.prompt,
            files:req.files
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
