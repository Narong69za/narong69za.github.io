// services/replicate.service.js

const fetch = require("node-fetch");
const db = require("../db/db");

const REPLICATE_API = process.env.REPLICATE_API_TOKEN;

const MODEL_MAP = {

   "dance-motion": "PUT_MODEL_VERSION_ID_HERE",
   "ai-lipsync": "PUT_MODEL_VERSION_ID_HERE",
   "face-swap": "PUT_MODEL_VERSION_ID_HERE",
   "dark-viral": "PUT_MODEL_VERSION_ID_HERE"

};

exports.run = async ({alias,type,prompt,files,jobID}) => {

   if(!MODEL_MAP[alias]){
      throw new Error("REPLICATE MODEL NOT FOUND");
   }

   console.log("REPLICATE EXEC:",alias);

   const response = await fetch("https://api.replicate.com/v1/predictions",{

      method:"POST",

      headers:{
         "Authorization":`Bearer ${REPLICATE_API}`,
         "Content-Type":"application/json"
      },

      body:JSON.stringify({

         version: MODEL_MAP[alias],

         input:{
            prompt: prompt || ""
         }

      })

   });

   const text = await response.text();

   let result;

   try{
      result = JSON.parse(text);
   }catch(err){
      console.error("REPLICATE RAW:",text);
      throw new Error("REPLICATE INVALID JSON");
   }

   if(!result.id){
      console.error(result);
      throw new Error("REPLICATE START FAILED");
   }

   db.run(
      "UPDATE projects SET status='processing', externalID=? WHERE id=?",
      [result.id, jobID]
   );

   return result;

};
