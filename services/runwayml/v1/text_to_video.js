// services/runwayml/v1/text_to_video.js

const axios = require("axios");

const RUNWAY_ENDPOINT = "https://api.dev.runwayml.com/v1/text_to_video";

async function createTextToVideo({ prompt }) {

  try {

    const response = await axios.post(
      RUNWAY_ENDPOINT,
      {
        promptText: prompt,
        ratio: "1280:720",
        duration: 4,
        model: "gen4.5"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RUNWAY_API_KEY}`,
          "X-Runway-Version": "2024-11-06",
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;

  } catch (err) {

    console.error("TEXT_TO_VIDEO ERROR:", err.response?.data || err.message);
    throw err;

  }

}

module.exports = {
  createTextToVideo
};
