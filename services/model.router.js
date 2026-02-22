/*
=====================================
ULTRA MODEL ROUTER CLEAN
SN DESIGN STUDIO
ALIAS → REAL MODEL MAP
=====================================
*/

const replicateService = require("./replicate/flux2pro");
const runwayService = require("./runway/gen4video");

/*
=====================================
MODEL ALIAS MAP
UI ส่ง alias
Backend map → real engine
=====================================
*/

const MODEL_MAP = {

   /*
   ==============================
   REPLICATE
   ==============================
   */

   "flux2pro-motion":{
      platform:"replicate",
      engine:"flux2pro",
      mode:"motion"
   },

   "flux2pro-lipsync":{
      platform:"replicate",
      engine:"flux2pro",
      mode:"lipsync"
   },

   "flux2pro-faceswap":{
      platform:"replicate",
      engine:"flux2pro",
      mode:"faceswap"
   },

   "flux2pro":{
      platform:"replicate",
      engine:"flux2pro",
      mode:"image"
   },


   /*
   ==============================
   RUNWAY GEN4
   ==============================
   */

   "gen4-motion":{
      platform:"runway",
      engine:"gen4",
      mode:"motion"
   },

   "gen4-lipsync":{
      platform:"runway",
      engine:"gen4",
      mode:"lipsync"
   },

   "gen4-faceswap":{
      platform:"runway",
      engine:"gen4",
      mode:"faceswap"
   },

   "gen4-darkviral":{
      platform:"runway",
      engine:"gen4",
      mode:"darkviral"
   }

};


/*
=====================================
RUN MODEL (MAIN ENTRY)
=====================================
*/

async function run(alias,input){

   const config = MODEL_MAP[alias];

   if(!config){

      throw new Error("MODEL ALIAS NOT FOUND: "+alias);

   }

   console.log(
      "RUN MODEL:",
      alias,
      "→",
      config.platform
   );


   /*
   ==============================
   REPLICATE
   ==============================
   */

   if(config.platform==="replicate"){

      return await replicateService.run({

         engine:config.engine,
         mode:config.mode,
         input

      });

   }


   /*
   ==============================
   RUNWAY
   ==============================
   */

   if(config.platform==="runway"){

      return await runwayService.run({

         engine:config.engine,
         mode:config.mode,
         input

      });

   }

   throw new Error("PLATFORM NOT SUPPORTED");

}

module.exports = { run };
