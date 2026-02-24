// services/runwayml/v1/video_upscale.js

const fetch = require("node-fetch");

const RUNWAY_API = "https://api.dev.runwayml.com/v1/video_upscale";

async function run(payload){

    const res = await fetch(RUNWAY_API, {

        method: "POST",

        headers: {
            "Authorization": `Bearer ${process.env.RUNWAY_API_KEY}`,
            "Content-Type": "application/json",
            "X-Runway-Version": "2024-11-06"
        },

        body: JSON.stringify({

            model: "upscale_v1",

            videoUri: payload.videoUri

        })

    });

    const text = await res.text();

    let data;
    try {
        data = JSON.parse(text);
    } catch(e){
        throw new Error("RUNWAY RESPONSE INVALID: "+text);
    }

    if(!res.ok){
        throw new Error("RUNWAY ERROR: "+text);
    }

    return data;

}

module.exports = { run };
