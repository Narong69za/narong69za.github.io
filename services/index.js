/*
=====================================
ULTRA ENGINE MASTER ROUTER
FINAL CLEAN VERSION
=====================================
*/

const presetMap = require("./preset.map");

const replicateService = require("./replicate/replicate.service");
const runwayService = require("./runway/runway.service");

const db = require("../db/db");


/*
=====================================
RUN ENGINE
=====================================
*/

async function runEngine(data){

   const { templateID, prompt, jobID } = data;

   if(!templateID || !jobID){

      throw new Error("MISSING REQUIRED DATA");

   }

   const preset = presetMap[templateID];

   if(!preset){

      throw new Error("INVALID PRESET");

   }

   let result = null;


   /*
   ======================
   PROVIDER ROUTING
   ======================
   */

   switch(preset.provider){

      case "replicate":

         if(!replicateService.run){

            throw new Error("REPLICATE SERVICE INVALID");

         }

         result = await replicateService.run({

            model: preset.model,
            prompt,
            jobID

         });

      break;


      case "runway":

         if(!runwayService.run){

            throw new Error("RUNWAY SERVICE INVALID");

         }

         result = await runwayService.run({

            model: preset.model,
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
      `INSERT OR REPLACE INTO projects
       (id, templateID, status, progress)
       VALUES (?,?,?,?)`,
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
