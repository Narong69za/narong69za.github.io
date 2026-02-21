/*
=====================================
REPLICATE SERVICE ENTRY
=====================================
*/

const flux2pro = require("./flux2pro");

async function run(id,data){

   switch(id){

      case "flux2pro":
         return flux2pro.run(data);

      default:
         throw new Error("Replicate model not implemented: "+id);
   }

}

module.exports = { run };
