// services/runwayml/v1/image_to_video.js

const fetch = require("node-fetch");

const ENDPOINT = "https://api.dev.runwayml.com/v1/image_to_video";

async function createImageToVideo(options = {}) {

  const res = await fetch(ENDPOINT, {

    method: "POST",

    headers: {
      Authorization: `Bearer ${process.env.RUNWAY_API_KEY}`,
      "Content-Type": "application/json",
      "X-Runway-Version": "2024-11-06"
    },

    body: JSON.stringify({
      model: "gen4.5",
      promptText: options.prompt,
      promptImage: [
        {
          uri: options.imageUrl,
          position: "first"
        }
      ],
      ratio: "720:1280",
      duration: 10
    })

  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(text);
  }

  return JSON.parse(text);
}

module.exports = { createImageToVideo };
