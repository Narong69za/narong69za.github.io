const imageToVideo = require("./image_to_video");
const videoUpscale = require("./video_upscale");
const textToVideo = require("./text_to_video");

async function run({ mode, payload }) {

  switch (mode) {

    case "text_to_video":
      return await textToVideo(payload);

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
