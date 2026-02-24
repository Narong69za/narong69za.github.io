// src/models/model.router.js

const imageToVideo = require("../services/runwayml/v1/image_to_video");
const videoUpscale = require("../services/runwayml/v1/video_upscale");

async function run(payload){

  const { engine, mode } = payload;

  if(engine === "runwayml"){

    if(mode === "image_to_video"){
      return await imageToVideo(payload);
    }

    if(mode === "video_upscale"){
      return await videoUpscale(payload);
    }

    throw new Error("Unsupported runway mode");
  }

  throw new Error("Unsupported engine");

}

module.exports = { run };
