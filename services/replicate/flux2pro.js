// services/replicate/flux2pro.js

const Replicate = require("replicate");
const db = require("../../db/db");

const replicate = new Replicate({
   auth: process.env.REPLICATE_API_TOKEN
});

exports.run = async ({alias,type,prompt,files,jobID}) => {

   console.log("REPLICATE EXEC:",alias);

   let input={};

   if(alias==="dark-viral"){
      input = {
         prompt:prompt,
         image:files.image.path
      };
   }

   if(alias==="face-swap"){
      input = {
         source:files.source.path,
         target:files.target.path
      };
   }

   const prediction = await replicate.predictions.create({
      model:"flux2pro",
      input
   });

   db.run(
      "UPDATE projects SET status='processing', externalID=? WHERE id=?",
      [prediction.id, jobID]
   );

   return prediction;
};
