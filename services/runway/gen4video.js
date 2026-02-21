/*
=====================================
RUNWAY GEN4 VIDEO
=====================================
*/

const fetch = require("node-fetch");

const TOKEN = process.env.RUNWAY_API_TOKEN;

async function run(data){

   const response = await fetch(
      "https://api.runwayml.com/v1/generate",
      {
         method:"POST",
         headers:{
            "Authorization":`Bearer ${TOKEN}`,
            "Content-Type":"application/json"
         },
         body:JSON.stringify({
            model:"gen4_image_to_video",
            input:{
               prompt:data.prompt
            }
         })
      }
   );

   return response.json();

}

module.exports = { run };
