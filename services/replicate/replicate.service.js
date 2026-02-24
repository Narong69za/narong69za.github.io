const fetch = require("node-fetch");
const db = require("../../db/db.js");

const REPLICATE_API = process.env.REPLICATE_API_TOKEN;

const REPLICATE_URL = "https://api.replicate.com/v1/predictions";

exports.run = async ({ alias, type, prompt, files, jobID }) => {

   console.log("REPLICATE EXEC:", alias);

   if (!REPLICATE_API) {
      throw new Error("REPLICATE TOKEN MISSING");
   }

   /* MODEL MAP — ตรง replicate จริง */
   const MODEL_MAP = {

      "dance-motion": {
         version: "YOUR_REAL_MODEL_VERSION_ID",
         input: {
            template: files?.template?.path,
            subject: files?.subject?.path,
            prompt: prompt || ""
         }
      },

      "ai-lipsync": {
         version: "YOUR_REAL_MODEL_VERSION_ID",
         input: {
            video: files?.video?.path,
            audio: files?.audio?.path
         }
      },

      "face-swap": {
         version: "YOUR_REAL_MODEL_VERSION_ID",
         input: {
            source: files?.source?.path,
            target: files?.target?.path
         }
      }

   };

   const model = MODEL_MAP[alias];

   if (!model) {
      throw new Error("MODEL NOT SUPPORTED");
   }

   const response = await fetch(REPLICATE_URL, {

      method: "POST",

      headers: {
         "Authorization": `Token ${REPLICATE_API}`,
         "Content-Type": "application/json"
      },

      body: JSON.stringify({
         version: model.version,
         input: model.input
      })

   });

   const result = await response.json();

   if (!result || !result.id) {
      console.log("REPLICATE RESPONSE:", result);
      throw new Error("REPLICATE START FAILED");
   }

   if (db && jobID) {
      db.run(
         "UPDATE projects SET status='processing', externalID=? WHERE id=?",
         [result.id, jobID]
      );
   }

   return result;

};
