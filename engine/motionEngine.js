/*
=====================================
SN DESIGN MOTION ENGINE
ULTRA PRODUCTION VERSION
=====================================
*/

const presetMap = require("../services/preset.map");
const replicateService = require("../services/replicate/replicate.service");
const runwayService = require("../services/runway/runway.service");

async function runEngine(data){

   const { templateID, prompt, jobID } = data;

   if(!templateID){
      throw new Error("TEMPLATE ID MISSING");
   }

   if(!jobID){
      throw new Error("JOB ID MISSING");
   }

   const preset = presetMap[templateID];

   if(!preset){
      throw new Error("PRESET NOT FOUND");
   }

   console.log("RUN ENGINE:", templateID);
   console.log("PROVIDER:", preset.provider);
   console.log("MODEL:", preset.model);
   console.log("PROMPT:", prompt);

   const payload = {
      model: preset.model,
      prompt,
      jobID
   };

   if(preset.provider === "replicate"){
      return await replicateService.run(payload);
   }

   if(preset.provider === "runway"){
      return await runwayService.run(payload);
   }

   throw new Error("UNKNOWN PROVIDER");

}

module.exports = {
   runEngine
};
