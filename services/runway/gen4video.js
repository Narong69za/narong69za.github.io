// services/runway/gen4video.js

const fetch = require("node-fetch");
const db = require("../../db/db");

const RUNWAY_API = process.env.RUNWAY_API;
const RUNWAY_URL = "https://api.runwayml.com/v1/tasks";

exports.run = async ({alias,type,prompt,files,jobID}) => {

   if(alias !== "dance-motion"){
      throw new Error("RUNWAY MODE NOT SUPPORTED");
   }

   const template = files.template;
   const subject = files.subject;

   if(!template || !subject){
      throw new Error("FILES MISSING");
   }

   console.log("RUNWAY EXEC:",alias);

   const response = await fetch(RUNWAY_URL,{
      method:"POST",
      headers:{
         "Authorization":`Bearer ${RUNWAY_API}`,
         "Content-Type":"application/json"
      },
      body:JSON.stringify({

         model:"gen4_motion_clone", // 👈 model name

         input:{
            template_url:template.path,
            subject_url:subject.path,
            prompt:prompt || ""
         }

      })
   });

   const text = await response.text();

   let result;

   try{
      result = JSON.parse(text);
   }catch(e){
      console.log("RUNWAY RAW RESPONSE:",text);
      throw new Error("RUNWAY INVALID JSON RESPONSE");
   }

   if(!result.id){
      throw new Error("RUNWAY START FAILED");
   }

   db.run(
      "UPDATE projects SET status='processing', externalID=? WHERE id=?",
      [result.id, jobID]
   );

   return result;
};
