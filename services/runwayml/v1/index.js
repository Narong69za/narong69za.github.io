/* =====================================================
RUNWAYML V1 MASTER ROUTER
services/runwayml/v1/index.js
===================================================== */

const imageToVideo = require("./image_to_video");
const videoUpscale = require("./video_upscale");

/*
SUPPORTED MODES

image2video
upscale
motion
lipsync
dance
*/

exports.run = async ({ mode, files, prompt, jobID }) => {

if (!mode) {
throw new Error("RUNWAY MODE REQUIRED");
}

/*
MODE ROUTING
*/

switch (mode) {

case "image2video":

if (!files?.fileAUrl) {
throw new Error("IMAGE URL REQUIRED");
}

return await imageToVideo.run({
prompt,
imageUrl: files.fileAUrl,
duration: 4,
jobID
});


case "upscale":

if (!files?.fileAUrl) {
throw new Error("VIDEO URL REQUIRED");
}

return await videoUpscale.run({
videoUrl: files.fileAUrl,
jobID
});


default:
throw new Error("RUNWAY MODE NOT SUPPORTED");

}

};
