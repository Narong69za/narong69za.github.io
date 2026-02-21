const fetch = require("node-fetch");

async function run(data){

   const res = await fetch(
      "https://api.runwayml.com/v1/generate",
      {
         method:"POST",
         headers:{
            "Authorization":`Bearer ${process.env.RUNWAY_API_TOKEN}`,
            "Content-Type":"application/json"
         },
         body:JSON.stringify({
            model:"gen4_image_to_video",
            input:{
               prompt:data.prompt || ""
            }
         })
      }
   );

   return await res.json();
}

module.exports = { run };
