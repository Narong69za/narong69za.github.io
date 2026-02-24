const fetch = require("node-fetch");

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

exports.run = async ({alias,prompt,files})=>{

   console.log("REPLICATE EXEC:",alias);

   const response = await fetch("https://api.replicate.com/v1/predictions",{

      method:"POST",

      headers:{
         Authorization:`Token ${REPLICATE_API_TOKEN}`,
         "Content-Type":"application/json"
      },

      body:JSON.stringify({

         version:"MODEL_VERSION_ID",

         input:{
            prompt:prompt || ""
         }

      })

   });

   const result = await response.json();

   if(!result.id){

      throw new Error("REPLICATE START FAILED");

   }

   return result;

};
