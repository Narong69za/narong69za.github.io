const registry = require("./model.registry");
const runway = require("../services/runwayml/v1");

async function run({ engine, alias, payload }) {

   const model = registry[alias];

   if(!model){
      throw new Error("MODEL NOT FOUND");
   }

   switch(model.engine){

      case "runwayml":

         return await runway.run({

            mode: model.mode,
            payload

         });

      default:

         throw new Error("ENGINE NOT SUPPORTED");

   }

}

module.exports = { run };
