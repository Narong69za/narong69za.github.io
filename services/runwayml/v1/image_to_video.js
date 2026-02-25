// services/runwayml/v1/image_to_video.js

const fetch = require("node-fetch");

const RUNWAY_API_KEY = process.env.RUNWAY_API_KEY;

exports.run = async ({prompt,files}) => {

   if(!RUNWAY_API_KEY){

      throw new Error("RUNWAY_API_KEY missing");

   }

   if(!files.fileA){

      throw new Error("fileA missing");

   }

   const imageFile = files.fileA;

   // NOTE:
   // ต้องมี public URL จริง (upload storage ก่อน)
   // ตอนนี้ใช้ path ชั่วคราวสำหรับ test

   const response = await fetch(
      "https://api.dev.runwayml.com/v1/image_to_video",
      {
         method:"POST",
         headers:{
            "Authorization":`Bearer ${RUNWAY_API_KEY}`,
            "Content-Type":"application/json",
            "X-Runway-Version":"2024-11-06"
         },
         body:JSON.stringify({

            promptText: prompt || "SN DESIGN TEST",

            promptImage:[
               {
                  uri:imageFile.path || "",
                  position:"first"
               }
            ],

            model:"gen4.5",
            ratio:"1280:720",
            duration:4

         })
      }
   );

   const text = await response.text();

   console.log("RUNWAY RAW RESPONSE:", text);

   return text;

};
