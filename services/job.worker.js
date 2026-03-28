// job.worker.js

const replicate = require("./services/replicate.service");
const runway = require("./services/runway/gen4video");

exports.run = async (job) => {

   const {engine,alias,type,prompt,files,jobID} = job;

   console.log("ULTRA ENGINE RUN:",engine,alias);

   if(engine === "replicate"){

      return await replicate.run({
         alias,
         type,
         prompt,
         files,
         jobID
      });

   }

   if(engine === "runway"){

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
