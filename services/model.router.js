/*
=====================================
ULTRA STATIC MODEL ROUTER
SN DESIGN STUDIO FINAL LOCK
=====================================
*/

const replicate = require("./replicate");
const runway = require("./runway");

console.log("=== STATIC MODEL ROUTER START ===");

async function runModel(data){

   const id = data.preset;

   console.log("RUN MODEL:", id);

   /*
   =====================================
   REPLICATE MODELS
   =====================================
   */

   switch(id){

      case "flux2pro":

         return replicate.run({
            provider:"replicate",
            model:"black-forest-labs/flux-2-pro"
         }, data);

      case "face-clone":

         return replicate.run({
            provider:"replicate",
            model:"lucataco/face-swap"
         }, data);

      /*
      =====================================
      RUNWAY MODELS
      =====================================
      */

      case "gen4-video":

         return runway.run({
            provider:"runway",
            model:"gen4_image_to_video"
         }, data);

      default:

         throw new Error("MODEL NOT IMPLEMENTED: " + id);

   }

}

module.exports = {
   runModel
};
