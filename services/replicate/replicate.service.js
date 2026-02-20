/*
=====================================
REPLICATE ENGINE SERVICE
ULTRA PRODUCTION VERSION
=====================================
*/

const Replicate = require("replicate");

const replicate = new Replicate({
   auth: process.env.REPLICATE_API_TOKEN
});

async function run({ model, prompt, jobID }){

   if(!process.env.REPLICATE_API_TOKEN){
      throw new Error("REPLICATE_API_TOKEN missing");
   }

   if(!model){
      throw new Error("REPLICATE MODEL NOT FOUND");
   }

   if(!prompt){
      throw new Error("PROMPT EMPTY");
   }

   try{

      // รองรับ preset model object
      let modelString;

      if(typeof model === "object"){
         modelString = `${model.id}:${model.version}`;
      }else{
         modelString = model;
      }

      const output = await replicate.run(
         modelString,
         {
            input:{
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
