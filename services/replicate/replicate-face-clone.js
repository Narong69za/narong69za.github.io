/*
=====================================
REPLICATE FACE CLONE SERVICE
SN DESIGN STUDIO
=====================================
*/

const fetch = global.fetch || require("node-fetch");

/*
=====================================
CONFIG
=====================================
*/

const REPLICATE_API = "https://api.replicate.com/v1/predictions";

/*
IMPORTANT:
ใส่ model version ของ replicate ที่คุณใช้
ตัวอย่าง:
owner/model:version_id
*/
const MODEL_VERSION = process.env.REPLICATE_FACE_CLONE_MODEL || "";

/*
=====================================
RUN
=====================================
*/

async function run(preset, data){

   try{

      console.log("REPLICATE FACE CLONE RUN");

      if(!process.env.REPLICATE_API_TOKEN){
         throw new Error("REPLICATE TOKEN NOT SET");
      }

      if(!MODEL_VERSION){
         throw new Error("MODEL VERSION NOT SET");
      }

      /*
      =====================
      BUILD INPUT
      =====================
      */

      const input = {
         prompt: data.prompt || "",
         image: data.image || null,
         ...data
      };

      /*
      =====================
      CALL REPLICATE API
      =====================
      */

      const response = await fetch(REPLICATE_API,{
         method:"POST",
         headers:{
            "Authorization":`Token ${process.env.REPLICATE_API_TOKEN}`,
            "Content-Type":"application/json"
         },
         body:JSON.stringify({
            version: MODEL_VERSION,
            input
         })
      });

      const result = await response.json();

      console.log("REPLICATE RESPONSE:", result.id);

      return {
         success:true,
         predictionId: result.id,
         data: result
      };

   }catch(err){

      console.error("REPLICATE FACE CLONE ERROR:", err.message);

      return {
         success:false,
         error: err.message
      };

   }

}

module.exports = {
   run
};
