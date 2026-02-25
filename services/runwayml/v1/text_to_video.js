const axios = require("axios");

const RUNWAY_ENDPOINT = "https://api.dev.runwayml.com/v1/text_to_video";

async function textToVideo({ prompt, duration = 4, ratio = "1280:720" }) {
  try {

    const response = await axios.post(
      RUNWAY_ENDPOINT,
      {
        promptText: prompt,
        ratio: ratio,
        duration: duration,
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

    console.error("RUNWAY ERROR:", err.response?.data || err.message);

    throw err;
  }
}

module.exports = textToVideo;
