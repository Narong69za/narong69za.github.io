/*
=====================================
STATIC MODEL ROUTER
NO PRESET AUTO LOAD
=====================================
*/

const replicate = require("./replicate");
const runway = require("./runway");

const MODELS = {

   flux2pro:{
      provider:"replicate"
   },

   gen4video:{
      provider:"runway"
   }

};

async function runModel(data){

   const model = MODELS[data.preset];

   if(!model){
      throw new Error("MODEL NOT FOUND: "+data.preset);
   }

   console.log("RUN MODEL:", data.preset);

   if(model.provider === "replicate"){
      return replicate.run(data.preset,data);
   }

   if(model.provider === "runway"){
      return runway.run(data.preset,data);
   }

   throw new Error("Provider not supported");

}

module.exports = { runModel };
