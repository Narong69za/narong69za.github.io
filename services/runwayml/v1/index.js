// services/runwayml/v1/index.js

const imageToVideo = require("./image_to_video");
const videoUpscale = require("./video_upscale");
const textToVideo = require("./text_to_video");

async function run({ mode, payload }) {

  switch (mode) {

    // IMAGE → VIDEO (เดิม)
    case "image2video":
    case "motion":
    case "dance":
    case "lipsync":
      return await imageToVideo.createImageToVideo(payload);

    // TEXT → VIDEO (GEN4.5)
    case "text2video":
    case "gen45":
      return await textToVideo(payload);

    // UPSCALE
    case "upscale":
      return await videoUpscale.createVideoUpscale(payload);

    default:
      throw new Error("RUNWAY MODE INVALID");

  }

}

module.exports = { run };
