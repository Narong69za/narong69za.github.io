// =====================================================
// RUNWAYML TEXT TO VIDEO (GEN4.5)
// FINAL PRODUCTION VERSION
// =====================================================

const axios = require("axios");

const RUNWAY_ENDPOINT = "https://api.dev.runwayml.com/v1/text_to_video";

async function createTextToVideo(payload) {

    if(!process.env.RUNWAY_API_KEY){
        throw new Error("RUNWAY_API_KEY missing");
    }

    try{

        const response = await axios.post(

            RUNWAY_ENDPOINT,

            {
                promptText: payload.prompt || "SN DESIGN TEST",
                ratio: payload.ratio || "1280:720",
                duration: payload.duration || 4,
                seed: payload.seed || Math.floor(Math.random()*9999999),
                model: "gen4.5"
            },

            {
                headers:{
                    Authorization: `Bearer ${process.env.RUNWAY_API_KEY}`,
                    "X-Runway-Version":"2024-11-06",
                    "Content-Type":"application/json"
                }
            }

        );

        console.log("RUNWAY TEXT2VIDEO OK:", response.data);

        return response.data;

    }catch(err){

        console.error(
            "RUNWAY TEXT2VIDEO ERROR:",
            err.response?.data || err.message
        );

        throw err;

    }

}

module.exports = {
    createTextToVideo
};
