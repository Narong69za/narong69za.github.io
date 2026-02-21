/*
=====================================
REPLICATE SERVICE ENTRY
SN DESIGN STUDIO FINAL FIX
=====================================
*/

const faceClone = require("./replicate-face-clone");

async function run(preset, data){

   console.log("REPLICATE RUN:", preset.id);

   switch(preset.id){

      case "replicate-face-clone":
         return faceClone.run(data);

      default:
         throw new Error("Replicate model not implemented: " + preset.id);
   }

}

module.exports = { run };
