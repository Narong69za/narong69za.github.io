const faceClone = require("./replicate-face-clone");
const imageGen = require("./replicate-image-gen");

async function run(preset,data){

   switch(preset.id){

      case "face-clone":
         return faceClone.run(preset,data);

      case "image-gen":
         return imageGen.run(preset,data);

      case "motion-control":
         return faceClone.run(preset,data); // ถ้า motion-control ใช้ replicate

      default:
         throw new Error("Replicate model not implemented: " + preset.id);
   }

}

module.exports = { run };
