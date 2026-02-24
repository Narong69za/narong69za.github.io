// services/runwayml/v1/index.js

const imageToVideo = require("./image_to_video");
const videoUpscale = require("./video_upscale");

async function run({ mode, payload }) {

  switch (mode) {

    case "image2video":
    case "motion":
    case "dance":
    case "lipsync":
      return await imageToVideo.createImageToVideo(payload);

    case "upscale":
      return await videoUpscale.createVideoUpscale(payload);

    default:
      throw new Error("RUNWAY MODE INVALID");

  }

}

module.exports = { run };
