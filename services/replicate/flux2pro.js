/*
=====================================
REPLICATE FLUX 2 PRO
=====================================
*/

const fetch = require("node-fetch");

const TOKEN = process.env.REPLICATE_API_TOKEN;

async function run(data){

   const response = await fetch(
      "https://api.replicate.com/v1/predictions",
      {
         method:"POST",
         headers:{
            "Authorization":`Token ${TOKEN}`,
            "Content-Type":"application/json"
         },
         body:JSON.stringify({
            version:"FLUX_VERSION_ID_HERE",
            input:{
               prompt:data.prompt
            }
         })
      }
   );

   return response.json();

}

module.exports = { run };
