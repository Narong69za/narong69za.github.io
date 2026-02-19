/*
=====================================
RUNWAY ENGINE SERVICE
=====================================
*/

const fetch = require("node-fetch");

async function run({ model, prompt, jobID }){

   const res = await fetch(

      "https://api.runwayml.com/v1/generate",

      {

         method:"POST",

         headers:{

            "Authorization":`Bearer ${process.env.RUNWAY_API_KEY}`,
            "Content-Type":"application/json"

         },

         body:JSON.stringify({

            model:model,
            input:{
               prompt:prompt
            }

         })

      }

   );

   const data = await res.json();

   return {

      jobID,
      output:data

   };

}

module.exports = {

   run

};
