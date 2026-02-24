const fetch = require("node-fetch");

const RUNWAY_API = process.env.RUNWAY_API;
const RUNWAY_URL = "https://api.runwayml.com/v1/motion_clone";

exports.run = async ({alias,prompt,files})=>{

   if(alias!=="dance-motion"){
      throw new Error("RUNWAY MODE NOT SUPPORTED");
   }

   const template = files.template;
   const subject = files.subject;

   if(!template || !subject){
      throw new Error("FILES MISSING");
   }

   const response = await fetch(RUNWAY_URL,{
      method:"POST",
      headers:{
         Authorization:`Bearer ${RUNWAY_API}`,
         "Content-Type":"application/json"
      },
      body:JSON.stringify({

         mode:"motion_clone",

         template_url: template.buffer.toString("base64"),

         subject_url: subject.buffer.toString("base64"),

         prompt: prompt || ""

      })
   });

   const result = await response.json();

   if(!result){

      throw new Error("RUNWAY START FAILED");

   }

   return result;

};
