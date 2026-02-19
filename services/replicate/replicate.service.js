/*
=====================================
REPLICATE ENGINE SERVICE
FINAL VERSION
=====================================
*/

const Replicate = require("replicate");

const replicate = new Replicate({

   auth: process.env.REPLICATE_API_TOKEN

});


async function run({ model, prompt, jobID }){

   if(!model){

      throw new Error("REPLICATE MODEL NOT FOUND");

   }

   if(!prompt){

      throw new Error("PROMPT EMPTY");

   }

   try{

      const output = await replicate.run(

         model, // ต้องเป็น owner/model:version

         {

            input: {

               prompt: prompt

            }

         }

      );

      return {

         jobID,
         output

      };

   }catch(err){

      console.error("REPLICATE ERROR:",err);

      throw err;

   }

}

module.exports = {

   run

};
