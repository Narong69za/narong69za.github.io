/*
=====================================
MODEL ROUTER (ALIAS SAFE MODE)
=====================================
*/

const replicate = require("./replicate/flux2pro");
const runway = require("./runway/gen4video");

/*
UI alias (fake name)
→ REAL ENGINE MAP
*/

const ROUTE = {

   "dance-motion":{
      replicate:{
         engine:"flux2pro",
         mode:"motion"
      },
      runway:{
         engine:"gen4",
         mode:"motion"
      }
   },

   "face-swap":{
      replicate:{
         engine:"flux2pro",
         mode:"faceswap"
      },
      runway:{
         engine:"gen4",
         mode:"faceswap"
      }
   },

   "ai-lipsync":{
      replicate:{
         engine:"flux2pro",
         mode:"lipsync"
      },
      runway:{
         engine:"gen4",
         mode:"lipsync"
      }
   },

   "dark-viral":{
      replicate:{
         engine:"flux2pro",
         mode:"image"
      },
      runway:{
         engine:"gen4",
         mode:"darkviral"
      }
   }

};


/*
=====================================
CORE RUN
=====================================
*/

async function run(alias, platform, input){

   const config = ROUTE[alias];

   if(!config){
      throw new Error("ALIAS NOT FOUND");
   }

   const target = config[platform];

   if(!target){
      throw new Error("PLATFORM NOT FOUND");
   }

   /*
   replicate
   */

   if(platform==="replicate"){

      return await replicate.run({
         engine:target.engine,
         mode:target.mode,
         input
      });

   }

   /*
   runway
   */

   if(platform==="runway"){

      return await runway.run({
         engine:target.engine,
         mode:target.mode,
         input
      });

   }

   throw new Error("UNKNOWN PLATFORM");

}


/*
=====================================
COMPATIBILITY LAYER
(for controller runModel)
=====================================
*/

async function runModel(payload){

   const { alias, engine, input } = payload;

   return await run(alias, engine, input);

}


/*
=====================================
EXPORT
=====================================
*/

module.exports = {
   run,
   runModel
};
