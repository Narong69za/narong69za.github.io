// services/runwayml/v1/video_upscale.js

const fetch = require("node-fetch");

const ENDPOINT = "https://api.dev.runwayml.com/v1/video_upscale";

async function createVideoUpscale(options = {}) {

  const res = await fetch(ENDPOINT, {

    method: "POST",

    headers: {
      Authorization: `Bearer ${process.env.RUNWAY_API_KEY}`,
      "Content-Type": "application/json",
      "X-Runway-Version": "2024-11-06"
    },

    body: JSON.stringify({
      model: "upscale_v1",
      videoUri: options.videoUri
    })

  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(text);
  }

  return JSON.parse(text);
}

module.exports = { createVideoUpscale };
