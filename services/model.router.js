/*
=====================================
ULTRA CLEAN MODEL ROUTER
SN DESIGN STUDIO FINAL
=====================================
*/

const presets = require("./preset.loader");

const replicateService = require("./replicate");
const runwayService = require("./runway");

console.log("=== MODEL ROUTER START ===");

/*
=====================================
GET MODEL
=====================================
*/

function getModel(id){

   const preset = presets[id];

   if(!preset){
      console.log("MODEL NOT FOUND:", id);
      return null;
   }

   return preset;
}

/*
=====================================
RUN MODEL (CORE ENGINE)
=====================================
*/

async function runModel(data){

   const preset = presets[data.preset];

   if(!preset){
      throw new Error("Preset not found: " + data.preset);
   }

   console.log("RUN MODEL:", preset.id, "provider:", preset.provider);

   if(preset.provider === "replicate"){

      return replicateService.run(preset,data);

   }

   if(preset.provider === "runway"){

      return runwayService.run(preset,data);

   }

   throw new Error("Provider not supported: " + preset.provider);

}

module.exports = {
   getModel,
   runModel
};
