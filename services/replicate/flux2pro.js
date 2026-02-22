/*
=====================================
REPLICATE FLUX2PRO ENGINE
=====================================
*/

const Replicate = require("replicate");

const replicate = new Replicate({
   auth:process.env.REPLICATE_API_TOKEN
});


/*
=====================================
MODEL MAP (internal only)
UI alias is hidden
=====================================
*/

const MODEL_MAP = {

   motion:"black-forest-labs/flux-2-pro",
   faceswap:"black-forest-labs/flux-2-pro",
   lipsync:"black-forest-labs/flux-2-pro",
   image:"black-forest-labs/flux-2-pro"

};


/*
=====================================
RUN
=====================================
*/

async function run(data){

   const {

      engine,
      mode,
      input

   } = data;

   const modelID = MODEL_MAP[mode];

   if(!modelID){

      throw new Error("REPLICATE MODE NOT SUPPORTED");

   }

   /*
   ULTRA SAFE INPUT
   */

   const payload = {

      prompt: input?.prompt || ""

   };

   /*
   CALL REPLICATE
   */

   const output = await replicate.run(

      modelID,
      {
         input:payload
      }

   );

   return output;

}

module.exports = { run };
