/*
=====================================
REPLICATE ENGINE SERVICE
=====================================
*/

const Replicate = require("replicate");

const replicate = new Replicate({

   auth: process.env.REPLICATE_API_TOKEN

});


async function run({ model, prompt, jobID }){

   const output = await replicate.run(

      model,

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

}

module.exports = {

   run

};
