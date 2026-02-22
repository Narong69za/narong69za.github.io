/*
=====================================
RUNWAY GEN4 ENGINE
=====================================
*/

const fetch = require("node-fetch");

/*
=====================================
MODEL MAP (hidden from UI)
=====================================
*/

const MODEL_MAP = {

   motion:"gen4_image_to_video",
   lipsync:"gen4_image_to_video",
   faceswap:"gen4_image_to_video",
   darkviral:"gen4_image_to_video"

};


/*
=====================================
RUN
=====================================
*/

async function run(data){

   const {

      mode,
      input

   } = data;

   const modelID = MODEL_MAP[mode];

   if(!modelID){

      throw new Error("RUNWAY MODE NOT SUPPORTED");

   }

   const payload = {

      model:modelID,

      input:{
         prompt: input?.prompt || ""
      }

   };

   const res = await fetch(

      "https://api.runwayml.com/v1/generate",

      {
         method:"POST",
         headers:{
            "Authorization":`Bearer ${process.env.RUNWAY_API_TOKEN}`,
            "Content-Type":"application/json"
         },
         body:JSON.stringify(payload)
      }

   );

   const json = await res.json();

   if(!res.ok){

      throw new Error(json.error || "RUNWAY API ERROR");

   }

   return json;

}

module.exports = { run };
