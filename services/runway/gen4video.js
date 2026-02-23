// src/services/runway/gen4video.js

const fetch = require("node-fetch");
const db = require("../../db/db");

const RUNWAY_API = process.env.RUNWAY_API;

const RUNWAY_MAP = {

   "dance-motion": true

};

exports.run = async ({alias,prompt,files,jobID})=>{

   if(!RUNWAY_MAP[alias]){
      throw new Error("RUNWAY MODE NOT SUPPORTED");
   }

   const template = files.template;
   const subject = files.subject;

   if(!template || !subject){
      throw new Error("FILES MISSING");
   }

   console.log("RUNWAY EXEC:",alias);

   const res = await fetch("https://api.runwayml.com/v1/motion_clone",{

      method:"POST",

      headers:{
         "Authorization":`Bearer ${RUNWAY_API}`,
         "Content-Type":"application/json"
      },

      body:JSON.stringify({

         mode:"motion_clone",
         template_url: template.path,
         subject_url: subject.path,
         prompt: prompt || ""

      })

   });

   const text = await res.text();

   let result;

   try{
      result = JSON.parse(text);
   }catch{
      console.log(text);
      throw new Error("RUNWAY INVALID JSON");
   }

   if(!result.id){
      console.log(result);
      throw new Error("RUNWAY START FAILED");
   }

   db.run(
      "UPDATE projects SET status='processing', externalID=? WHERE id=?",
      [result.id, jobID]
   );

   return result;

};
