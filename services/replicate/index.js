/*
=====================================
REPLICATE SERVICE ENTRY
SN DESIGN STUDIO
=====================================
*/

const faceClone = require("./replicate-face-clone");
const imageGen = require("./replicate-image-gen");

async function run(preset,data){

   console.log("REPLICATE RUN:", preset.id);

   switch(preset.id){

      case "replicate-face-clone":
         return faceClone.run(data);

      case "replicate-image-gen":
         return imageGen.run(data);

      default:
         throw new Error("Replicate model not implemented: " + preset.id);
   }

}

module.exports = { run };
