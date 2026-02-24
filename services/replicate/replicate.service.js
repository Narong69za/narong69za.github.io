const fetch = require("node-fetch");
const db = require("../../db/db.js");

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const REPLICATE_URL = "https://api.replicate.com/v1/predictions";

exports.run = async ({alias,type,prompt,files,jobID}) => {

   console.log("REPLICATE EXEC:",alias);

   const response = await fetch(REPLICATE_URL,{
      method:"POST",
      headers:{
         "Authorization":`Token ${REPLICATE_API_TOKEN}`,
         "Content-Type":"application/json"
      },
      body:JSON.stringify({
         version: alias,
         input:{
            prompt:prompt || ""
         }
      })
   });

   const result = await response.json();

   if(!result.id){
      throw new Error("REPLICATE START FAILED");
   }

   db.run(
      "UPDATE projects SET status='processing', externalID=? WHERE id=?",
      [result.id, jobID]
   );

   return result;
};
