const flux2pro = require("./flux2pro");

async function run(data){

   switch(data.preset){

      case "image-gen":
      case "motion-control":
      case "face-clone":

         return flux2pro.run(data);

      default:
         throw new Error("REPLICATE MODEL NOT FOUND");

   }

}

module.exports = { run };
