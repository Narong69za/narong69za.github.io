const gen4 = require("./gen4video");

async function run(data){

   switch(data.preset){

      case "gen4-video":
         return gen4.run(data);

      default:
         throw new Error("RUNWAY MODEL NOT FOUND");

   }

}

module.exports = { run };
