// services/runwayml/v1/index.js

const imageToVideo = require("./image_to_video");
const videoUpscale = require("./video_upscale");
const textToVideo = require("./text_to_video");

async function run({ payload }) {

  try {

    const { files, prompt, type } = payload || {};

    const hasFileA = files && files.fileA;
    const hasFileB = files && files.fileB;

    /* ===============================
       AUTO MODE DETECT
    =============================== */

    // 🎞 UPSCALE
    if (type === "upscale") {
      console.log("RUNWAY AUTO MODE: UPSCALE");
      return await videoUpscale.createVideoUpscale(payload);
    }

    // 🖼🖼 MOTION / DUAL FILE
    if (hasFileA && hasFileB) {
      console.log("RUNWAY AUTO MODE: DUAL FILE");
      return await imageToVideo.createImageToVideo(payload);
    }

    // 🖼 IMAGE → VIDEO
    if (hasFileA && !hasFileB) {
      console.log("RUNWAY AUTO MODE: IMAGE_TO_VIDEO");
      return await imageToVideo.createImageToVideo(payload);
    }

    // 🔤 TEXT ONLY
    if (!hasFileA && prompt) {
      console.log("RUNWAY AUTO MODE: TEXT_TO_VIDEO");
      return await textToVideo(payload);
    }

    throw new Error("RUNWAY AUTO MODE FAILED");

  } catch (err) {

    console.error("RUNWAY ULTRA ENGINE ERROR:", err.message);
    throw err;

  }

}

module.exports = { run };
