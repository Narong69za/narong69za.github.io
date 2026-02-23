// services/runway/gen4video.js

const fetch = require("node-fetch");
const db = require("../../db/db");

const RUNWAY_API = process.env.RUNWAY_API;

const RUNWAY_MODEL_MAP = {

   "dance-motion": "motion_clone"

};

exports.run = async ({alias,type,prompt,files,jobID}) => {

   if(!RUNWAY_MODEL_MAP[alias]){
      throw new Error("RUNWAY MODE NOT SUPPORTED");
   }

   const template = files.template;
   const subject = files.subject;

   if(!template || !subject){
      throw new Error("FILES MISSING");
   }

   console.log("RUNWAY EXEC:",alias);

   const response = await fetch("https://api.runwayml.com/v1/motion_clone",{

      method:"POST",

      headers:{
         "Authorization":`Bearer ${RUNWAY_API}`,
         "Content-Type":"application/json"
      },

      body:JSON.stringify({

         mode: RUNWAY_MODEL_MAP[alias],

         template_url: template.path,
         subject_url: subject.path,
         prompt: prompt || ""

      })

   });

   const text = await response.text();

   let result;

   try{
      result = JSON.parse(text);
   }catch(err){
      console.error("RUNWAY RAW:",text);
      throw new Error("RUNWAY INVALID JSON");
   }

   if(!result.id){
      console.error(result);
      throw new Error("RUNWAY START FAILED");
   }

   db.run(
      "UPDATE projects SET status='processing', externalID=? WHERE id=?",
      [result.id, jobID]
   );

   return result;

};
