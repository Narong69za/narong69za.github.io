/*
=====================================
REPLICATE SERVICE
LOCK ROUTER
=====================================
*/

const faceClone = require("./replicate-face-clone.js");

async function run(preset,data){

   switch(preset.id){

      case "face-clone":
         return faceClone.run(data);

      default:
         throw new Error("Replicate model not found");
   }

}

module.exports = { run };
