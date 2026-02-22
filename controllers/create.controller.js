/*
=====================================
CREATE CONTROLLER
FINAL CLEAN VERSION
=====================================
*/

const MODEL_ROUTER = require("../services/model.router");

async function create(req,res){

   try{

      /*
      =====================================
      EXPECT PAYLOAD
      =====================================

      {
         alias:"dance-motion",
         platform:"replicate" | "runway",
         prompt:"",
         type:"",
         file:null
      }

      */

      const { alias, platform, prompt, type } = req.body;

      if(!alias){

         throw new Error("ALIAS NOT FOUND FROM CONTROLLER");

      }

      if(!platform){

         throw new Error("PLATFORM NOT FOUND");

      }

      /*
      =====================================
      CALL MODEL ROUTER
      =====================================
      */

      const result = await MODEL_ROUTER.run(

         alias,
         platform,
         {
            prompt: prompt || "",
            type: type || ""
         }

      );

      res.json({
         success:true,
         result
      });

   }catch(err){

      console.log("CREATE ERROR:",err.message);

      res.status(500).json({
         success:false,
         error:err.message
      });

   }

}

module.exports = { create };
