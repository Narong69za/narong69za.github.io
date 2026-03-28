const fetch = require("node-fetch");
const db = require("../../db/db");

const REPLICATE_API = process.env.REPLICATE_API_TOKEN;

exports.run = async ({alias,type,prompt,files,jobID}) => {

   console.log("REPLICATE EXEC:",alias);

   const response = await fetch(
      "https://api.replicate.com/v1/predictions",
      {
         method:"POST",
         headers:{
            "Authorization":`Token ${REPLICATE_API}`,
            "Content-Type":"application/json"
         },
         body:JSON.stringify({

            version:"PUT_MODEL_VERSION_ID_HERE",

            input:{
               prompt:prompt || ""
            }

         })
      }
   );

   const text = await response.text();

   let result;

   try{
      result = JSON.parse(text);
   }catch(e){
      console.log("REPLICATE RAW RESPONSE:",text);
      throw new Error("REPLICATE INVALID JSON");
   }

   if(!result.id){
      throw new Error("REPLICATE START FAILED");
   }

   db.run(
      "UPDATE projects SET status='processing', externalID=? WHERE id=?",
      [result.id,jobID]
   );

   return result;
};
