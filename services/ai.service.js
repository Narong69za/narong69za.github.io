const Replicate = require("replicate");

const replicate = new Replicate({
   auth: process.env.REPLICATE_API_TOKEN
});

async function runAI(model,input){

   const output = await replicate.run(model,{
      input:input
   });

   return output;
}

module.exports = { runAI };
