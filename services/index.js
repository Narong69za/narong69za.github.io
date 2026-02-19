/*
=====================================
ULTRA ENGINE MASTER ROUTER
=====================================
*/

const presetMap = require("./preset.map");

const replicateService = require("./replicate/replicate.service");
const runwayService = require("./runway/runway.service");

const db = require("../db/db");


async function runEngine(data){

   const { templateID, prompt, jobID } = data;

   const preset = presetMap[templateID];

   if(!preset){

      throw new Error("INVALID PRESET");

   }

   let result;

   /*
   ======================
   PROVIDER ROUTING
   ======================
   */

   switch(preset.provider){

      case "replicate":

         result = await replicateService.run({

            model: preset.model.id,
            prompt,
            jobID

         });

      break;


      case "runway":

         result = await runwayService.run({

            model: preset.model.id,
            prompt,
            jobID

         });

      break;

      default:

         throw new Error("PROVIDER NOT FOUND");

   }


   /*
   ======================
   SAVE DB
   ======================
   */

   db.run(
      "INSERT INTO projects (id, template, status, progress) VALUES (?,?,?,?)",
      [jobID, templateID, "processing", 0]
   );

   return {

      jobID,
      result

   };

}

module.exports = {

   runEngine

};
