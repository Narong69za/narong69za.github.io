// services/model.router.js

const replicate = require("./replicate/flux2pro");
const runway = require("./runway/gen4video");

/*
AUTO ENGINE ROUTER
*/

exports.run = async ({engine,alias,type,prompt,files,jobID})=>{

   if(engine==="replicate"){

      return await replicate.run({

         alias,
         type,
         prompt,
         files,
         jobID

      });

   }

   if(engine==="runway"){

      return await runway.run({

         alias,
         type,
         prompt,
         files,
         jobID

      });

   }

   throw new Error("ENGINE NOT FOUND");

};
