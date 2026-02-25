// =====================================================
// SN DESIGN ENGINE AI
// ULTRA AUTO RUNWAY ENGINE
// AUTO DETECT MODE
// =====================================================

const textToVideo = require("./text_to_video");
const imageToVideo = require("./image_to_video");
const videoUpscale = require("./video_upscale");
const poller = require("./runway.poller");

async function run({ mode, payload }) {

   try {

      const { prompt, files } = payload || {};

      let result;

      // ==========================================
      // AUTO DETECT ENGINE
      // ==========================================

      // 🔥 TEXT ONLY → GEN4.5
      if(prompt && (!files || !files.fileA)){

         console.log("RUNWAY AUTO MODE: TEXT_TO_VIDEO");

         result = await textToVideo({

            prompt,
            duration: payload.duration || 4,
            ratio: payload.ratio || "1280:720"

         });

      }

      // 🔥 IMAGE INPUT
      else if(files && files.fileA){

         console.log("RUNWAY AUTO MODE: IMAGE_TO_VIDEO");

         result = await imageToVideo.createImageToVideo(payload);

      }

      // 🔥 UPSCALE
      else if(mode === "upscale"){

         console.log("RUNWAY AUTO MODE: UPSCALE");

         result = await videoUpscale.createVideoUpscale(payload);

      }

      else{

         throw new Error("RUNWAY INPUT INVALID");

      }


      // ==========================================
      // AUTO POLL RESULT
      // ==========================================

      const taskId = result.id;

      if(!taskId){

         throw new Error("RUNWAY TASK ID MISSING");

      }

      console.log("RUNWAY TASK CREATED:", taskId);

      const finalResult = await poller.poll(taskId);

      return finalResult;

   } catch(err){

      console.error("RUNWAY ULTRA ENGINE ERROR:", err.message);

      throw err;
   }
}

module.exports = { run };
