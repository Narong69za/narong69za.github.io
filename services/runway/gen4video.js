const fetch = require("node-fetch");
const db = require("../../db/db.js");

const RUNWAY_API = process.env.RUNWAY_API;
const RUNWAY_URL = "https://api.runwayml.com/v1/motion_clone";

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
         mode:"motion_clone",
         template_url:template.path,
         subject_url:subject.path,
         prompt:prompt || ""
      })
   });

   const result = await response.json();

   if(!result.id){
      throw new Error("RUN
