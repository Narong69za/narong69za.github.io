/*
=====================================
ULTRA AUTO MODEL ROUTER
SN DESIGN STUDIO CORE ENGINE
=====================================
*/

const presets = require("../services/preset.loader");

console.log("=== MODEL ROUTER START ===");

function buildUI(preset){

   if(!preset) return null;

   let ui = {
      engine: preset.id,
      provider: preset.provider,
      credit: preset.creditCost || 0,
      limit: preset.limits?.maxDuration || 0,
      fields: []
   };

   /*
   =========================
   AUTO UI BY PROVIDER
   =========================
   */

   if(preset.provider === "runwayml"){

      ui.fields = [
         {type:"file", name:"media", label:"Upload Media"},
         {type:"text", name:"prompt", label:"Prompt"}
      ];

   }

   if(preset.provider === "replicate"){

      ui.fields = [
         {type:"file", name:"image", label:"Upload Image"},
         {type:"text", name:"prompt", label:"Prompt"}
      ];

   }

   return ui;
}

/*
=====================================
GET MODEL BY ID
=====================================
*/

function getModel(modelId){

   const preset = presets[modelId];

   if(!preset){
      return null;
   }

   const ui = buildUI(preset);

   return {
      preset,
      ui
   };
}

/*
=====================================
GET ALL MODELS
=====================================
*/

function getAll(){

   let list = [];

   Object.keys(presets).forEach(id => {

      const preset = presets[id];

      list.push({
         id: preset.id,
         name: preset.name,
         provider: preset.provider
      });

   });

   return list;
}

module.exports = {
   getModel,
   getAll
};
