const Replicate = require("replicate");

const replicate = new Replicate({
   auth:process.env.REPLICATE_API_TOKEN
});

async function run(data){

   const output = await replicate.run(
      "black-forest-labs/flux-2-pro",
      {
         input:{
            prompt:data.prompt || ""
         }
      }
   );

   return output;
}

module.exports = { run };
