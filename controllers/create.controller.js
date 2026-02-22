const MODEL_ROUTER = require("../services/model.router");

async function create(req,res){

   try{

      console.log("REQ BODY:",req.body);

      const { alias, platform, prompt } = req.body;

      if(!alias || !platform){

         throw new Error("ALIAS OR PLATFORM MISSING");

      }

      const result = await MODEL_ROUTER.run(
         alias,
         platform,
         {
            prompt: prompt || ""
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
