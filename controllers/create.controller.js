const MODEL_ROUTER = require("../services/model.router");

async function create(req,res){

   try{

      const { platform, mode, type, prompt } = req.body;

      /*
      map UI mode -> alias router
      */

      let alias = null;

      if(mode==="motion") alias="dance-motion";
      if(mode==="face") alias="face-swap";
      if(mode==="lipsync") alias="ai-lipsync";
      if(mode==="dark") alias="dark-viral";

      if(!alias){

         throw new Error("ALIAS NOT FOUND FROM CONTROLLER");

      }

      const result = await MODEL_ROUTER.run(

         alias,
         platform,
         {
            prompt,
            type
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
