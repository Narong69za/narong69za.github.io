// =====================================================
// RUNWAYML ENGINE ROUTER
// FINAL VERSION
// =====================================================

const textToVideo = require("./text_to_video");
const imageToVideo = require("./image_to_video");
const videoUpscale = require("./video_upscale");

async function run({ mode, payload }) {

    switch(mode){

        case "text_to_video":
        case "text2video":
            return await textToVideo.createTextToVideo(payload);

        case "image_to_video":
        case "image2video":
        case "motion":
        case "dance":
        case "lipsync":
            return await imageToVideo.run(payload);

        case "upscale":
            return await videoUpscale.run(payload);

        default:
            throw new Error("RUNWAY MODE INVALID: " + mode);

    }

}

module.exports = { run };
