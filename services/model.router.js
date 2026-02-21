/*
=====================================
ULTRA FINAL CLEAN ROUTER
SN DESIGN STUDIO
NO AUTO LOAD
=====================================
*/

const replicateService = require("./replicate");
const runwayService = require("./runway");

/*
LOCK MODEL CONFIG
*/

const MODELS = {

   "face-clone":{
      provider:"replicate"
   },

   "image-gen":{
      provider:"replicate"
   },

   "gen4-video":{
      provider:"runway"
   }

};

function getModel(id){

   return MODELS[id] || null;

}

async function runModel(data){

   const model = MODELS[data.preset];

   if(!model){
      throw new Error("Model not found");
   }

   console.log("RUN MODEL:", data.preset);

   if(model.provider === "replicate"){
      return replicateService.run({id:data.preset},data);
   }

   if(model.provider === "runway"){
      return runwayService.run({id:data.preset},data);
   }

   throw new Error("Provider not supported");

}

module.exports = {
   getModel,
   runModel
};
