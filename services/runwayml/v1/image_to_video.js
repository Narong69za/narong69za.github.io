// services/runwayml/v1/image_to_video.js

const fetch = require("node-fetch");

const RUNWAY_API = "https://api.dev.runwayml.com/v1/image_to_video";

async function run(payload){

    const res = await fetch(RUNWAY_API, {

        method: "POST",

        headers: {
            "Authorization": `Bearer ${process.env.RUNWAY_API_KEY}`,
            "Content-Type": "application/json",
            "X-Runway-Version": "2024-11-06"
        },

        body: JSON.stringify({

            model: payload.model || "gen4.5",

            promptText: payload.prompt,

            promptImage: payload.images,

            ratio: payload.ratio || "1280:720",

            duration: payload.duration || 4,

            seed: payload.seed || Math.floor(Math.random()*999999999)

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
