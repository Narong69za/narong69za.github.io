/*
=====================================
ULTRA STATIC MODEL ROUTER
SN DESIGN STUDIO FINAL LOCK
=====================================
*/

const replicateService = require("./replicate");
const runwayService = require("./runway");

console.log("=== STATIC MODEL ROUTER START ===");

/*
=====================================
STATIC MODEL MAP (LOCKED)
=====================================
*/

const MODEL_MAP = {

   // REPLICATE
   "dark-viral": {
      provider:"replicate",
      model:"flux2pro"
   },

   "ai-lipsync": {
      provider:"replicate",
      model:"flux2pro"
   },

   "dance-motion": {
      provider:"replicate",
      model:"flux2pro"
   },

   "face-swap": {
      provider:"replicate",
      model:"flux2pro"
   },

   // RUNWAY
   "gen4-video":{
      provider:"runwayml",
      model:"gen4video"
   }

};


/*
=====================================
RUN MODEL
=====================================
*/

async function runModel(data){

   const config = MODEL_MAP[data.preset];

   if(!config){

      throw new Error("MODEL NOT FOUND: " + data.preset);

   }

   console.log("RUN MODEL:",data.preset,"→",config.provider);

   if(config.provider==="replicate"){

      return replicateService.run(config,data);

   }

   if(config.provider==="runwayml"){

      return runwayService.run(config,data);

   }

   throw new Error("Provider not supported");

}

module.exports = {

   runModel

};
