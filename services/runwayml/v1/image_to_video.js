/* =====================================================
RUNWAYML IMAGE → VIDEO (GEN4.5)
services/runwayml/v1/image_to_video.js
===================================================== */

const fetch = require("node-fetch");
const db = require("../../../db/db");

const RUNWAY_API_KEY = process.env.RUNWAY_API;
const RUNWAY_ENDPOINT = "https://api.dev.runwayml.com/v1/image_to_video";

exports.run = async ({ prompt, imageUrl, duration = 4, jobID }) => {

if (!RUNWAY_API_KEY) {
throw new Error("RUNWAY_API KEY MISSING");
}

if (!imageUrl) {
throw new Error("IMAGE URL REQUIRED");
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
promptText: prompt || "",
promptImage: [
{
uri: imageUrl,
position: "first"
}
],
model: "gen4.5",
ratio: "1280:720",
duration: duration,
seed: Math.floor(Math.random() * 9999999999)
})
});

const result = await response.json();

/* DEBUG LOG */
console.log("RUNWAY RESPONSE:", result);

/* Runway returns id for polling */
if (!result.id) {
throw new Error("RUNWAY START FAILED");
}

/* Save external job ID */

await new Promise((resolve, reject) => {
db.run(
"UPDATE projects SET status='processing', externalID=? WHERE id=?",
[result.id, jobID],
(err) => err ? reject(err) : resolve()
);
});

return result;

} catch (err) {

console.error("RUNWAY IMAGE2VIDEO ERROR:", err);

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
