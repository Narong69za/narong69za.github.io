const MODEL_ROUTER = require("../services/model.router");
const path = require("path");

async function create(req,res){

   try{

      const { alias, platform, prompt } = req.body;

      if(!alias || !platform){

         throw new Error("ALIAS OR PLATFORM MISSING");

      }

      let inputFile = null;

      if(req.file){

         inputFile = "/storage/input/"+req.file.filename;

      }

      const result = await MODEL_ROUTER.run(

         alias,
         platform,
         {
            prompt: prompt || "",
            file: inputFile
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
