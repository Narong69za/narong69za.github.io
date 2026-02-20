/*
=====================================
ULTRA AUTO MODEL ROUTER
SN DESIGN STUDIO FINAL
=====================================
*/

const presets = require("./preset.loader");

const replicateService = require("./replicate");
const runwayService = require("./runway");

console.log("=== MODEL ROUTER START ===");

/*
=====================================
AUTO UI BUILDER
=====================================
*/

function buildUI(preset){

   if(!preset) return null;

   const ui = {
      engine: preset.id,
      provider: preset.provider,
      credit: preset.creditCost || 0,
      limit: preset.limits?.maxDuration || 0,
      fields:[]
   };

   if(preset.provider === "runwayml"){

      ui.fields = [
         {type:"file", name:"media"},
         {type:"text", name:"prompt"}
      ];

   }

   if(preset.provider === "replicate"){

      ui.fields = [
         {type:"file", name:"image"},
         {type:"text", name:"prompt"}
      ];

   }

   return ui;
}

/*
=====================================
GET MODEL CONFIG
=====================================
*/

function getModel(id){

   const preset = presets[id];

   if(!preset){
      console.log("MODEL NOT FOUND:", id);
      return null;
   }

   return {
      preset,
      ui: buildUI(preset)
   };
}

/*
=====================================
RUN MODEL (CORE FIX)
=====================================
*/

async function runModel(data){

   const preset = presets[data.preset];

   if(!preset){
      throw new Error("Preset not found");
   }

   console.log("RUN MODEL:", preset.id, "provider:", preset.provider);

   /*
   ======================
   AUTO ROUTE BY PROVIDER
   ======================
   */

   if(preset.provider === "replicate"){

      return replicateService.run(preset,data);

   }

   if(preset.provider === "runwayml"){

      return runwayService.run(preset,data);

   }

   throw new Error("Provider not supported");

}

module.exports = {
   getModel,
   runModel
};
