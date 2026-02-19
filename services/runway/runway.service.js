/*
=====================================
RUNWAY SERVICE
FINAL CLEAN VERSION
=====================================
*/

const RUNWAY_API_KEY = process.env.RUNWAY_API_KEY;

async function createRunwayJob(preset, prompt){

    let model="";

    // mapping preset → model
    if(preset==="cinematic-pro"){
        model="gen4_image";
    }

    if(preset==="dance-motion"){
        model="act_two";
    }

    const res = await fetch("https://api.runwayml.com/v1/generate",{

        method:"POST",

        headers:{
            "Authorization":`Bearer ${RUNWAY_API_KEY}`,
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            model:model,
            input:{
                prompt:prompt
            }
        })

    });

    const data = await res.json();

    return data;
}

module.exports={createRunwayJob};
