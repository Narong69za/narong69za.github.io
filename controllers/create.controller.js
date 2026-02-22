const MODEL_ROUTER = require("../services/model.router");

async function create(req,res){

   try{

      console.log("REQ BODY:", req.body);

      const { platform, mode, type, prompt } = req.body;

      /*
      UI MODE → ROUTER ALIAS
      FINAL MAP
      */

      const MODE_ALIAS = {

         motion:"dance-motion",
         face:"face-swap",
         lipsync:"ai-lipsync",
         dark:"dark-viral"

      };

      const alias = MODE_ALIAS[mode];

      if(!alias){

         throw new Error("ALIAS NOT FOUND FROM CONTROLLER");

      }

      const result = await MODEL_ROUTER.run(
         alias,
         platform,
         {
            type,
            prompt
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
