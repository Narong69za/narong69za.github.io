/*
=====================================
RUNWAY SERVICE ENTRY
=====================================
*/

const gen4video = require("./gen4video");

async function run(id,data){

   switch(id){

      case "gen4video":
         return gen4video.run(data);

      default:
         throw new Error("Runway model not implemented: "+id);
   }

}

module.exports = { run };
