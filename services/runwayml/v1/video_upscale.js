/* =====================================================
RUNWAYML VIDEO UPSCALE (GEN4 UPSCALE V1)
services/runwayml/v1/video_upscale.js
===================================================== */

const fetch = require("node-fetch");
const db = require("../../../db/db");

const RUNWAY_API_KEY = process.env.RUNWAY_API;
const RUNWAY_ENDPOINT = "https://api.dev.runwayml.com/v1/video_upscale";

exports.run = async ({ videoUrl, jobID }) => {

if (!RUNWAY_API_KEY) {
throw new Error("RUNWAY_API KEY MISSING");
}

if (!videoUrl) {
throw new Error("VIDEO URL REQUIRED");
}

try {

const response = await fetch(RUNWAY_ENDPOINT, {
method: "POST",
headers: {
"Authorization": `Bearer ${RUNWAY_API_KEY}`,
"Content-Type": "application/json",
"X-Runway-Version": "2024-11-06"
},
body: JSON.stringify({
model: "upscale_v1",
videoUri: videoUrl
})
});

const result = await response.json();

/* DEBUG LOG */
console.log("RUNWAY UPSCALE RESPONSE:", result);

/*
Runway returns job id for processing
*/

if (!result.id) {
throw new Error("RUNWAY UPSCALE START FAILED");
}

/* Update DB status */

await new Promise((resolve, reject) => {
db.run(
"UPDATE projects SET status='processing', externalID=? WHERE id=?",
[result.id, jobID],
(err) => err ? reject(err) : resolve()
);
});

return result;

} catch (err) {

console.error("RUNWAY UPSCALE ERROR:", err);

await new Promise((resolve) => {
db.run(
"UPDATE projects SET status='failed' WHERE id=?",
[jobID],
() => resolve()
);
});

throw err;
}

};
