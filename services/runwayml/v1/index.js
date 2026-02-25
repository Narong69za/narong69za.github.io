// services/runwayml/v1/index.js

const imageToVideo = require("./image_to_video");
const videoUpscale = require("./video_upscale");

// ✅ ADD ONLY
const textToVideo = require("./text_to_video");

async function run({ mode, payload }) {

  try {

    switch (mode) {

      case "image2video":
      case "motion":
      case "dance":
      case "lipsync":
        return await imageToVideo.createImageToVideo(payload);

      case "upscale":
        return await videoUpscale.createVideoUpscale(payload);

      // ✅ ADD TEXT MODE
      case "text_to_video":
        console.log("RUNWAY AUTO MODE: TEXT_TO_VIDEO");
        return await textToVideo(payload);

      default:
        throw new Error("RUNWAY MODE INVALID");

    }

  } catch (err) {

    console.error("RUNWAY ULTRA ENGINE ERROR:", err.message);
    throw err;

  }

}

module.exports = { run };
