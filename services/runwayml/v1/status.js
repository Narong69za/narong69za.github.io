const axios = require("axios");

const RUNWAY_STATUS_ENDPOINT = "https://api.dev.runwayml.com/v1/tasks";

async function getRunwayStatus(taskId) {

   try {

      const response = await axios.get(
         `${RUNWAY_STATUS_ENDPOINT}/${taskId}`,
         {
            headers: {
               Authorization: `Bearer ${process.env.RUNWAY_API_KEY}`,
               "Content-Type": "application/json"
            }
         }
      );

      return response.data;

   } catch (err) {

      console.error("RUNWAY STATUS ERROR:", err.response?.data || err.message);
      throw err;

   }

}

module.exports = {
   getRunwayStatus
};
