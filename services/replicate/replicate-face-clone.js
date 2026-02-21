/*
=====================================
REPLICATE FACE CLONE SERVICE
SN DESIGN STUDIO FINAL
=====================================
*/

const fetch = require("node-fetch");

const REPLICATE_API = "https://api.replicate.com/v1/predictions";

const TOKEN = process.env.REPLICATE_API_TOKEN;

async function run(preset,data){

   console.log("FACE CLONE START");

   if(!TOKEN){
      throw new Error("Missing REPLICATE_API_TOKEN");
   }

   const body = {
      version: preset.version, // ดึงจาก preset.map
      input: {
         prompt: data.prompt || "",
         image: data.image || null
      }
   };

   const res = await fetch(REPLICATE_API,{
      method:"POST",
      headers:{
         "Authorization":`Token ${TOKEN}`,
         "Content-Type":"application/json"
      },
      body:JSON.stringify(body)
   });

   const json = await res.json();

   if(json.error){
      throw new Error(json.error);
   }

   return json;

}

module.exports = { run };
