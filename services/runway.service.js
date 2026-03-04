/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: services/runway.service.js
VERSION: v1.0.0
STATUS: production
RESPONSIBILITY:
- call runway api
- upload media
- generate tasks
- poll tasks
===================================================== */

const fetch = require("node-fetch")

const RUNWAY_API = "https://api.dev.runwayml.com/v1"
const RUNWAY_KEY = process.env.RUNWAY_API_KEY

async function upload(req){

    const response = await fetch(`${RUNWAY_API}/uploads`,{

        method:"POST",

        headers:{
            "Authorization":`Bearer ${RUNWAY_KEY}`,
            "X-Runway-Version":"2024-11-06",
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            filename:"upload.file",
            type:"ephemeral"
        })

    })

    const data = await response.json()

    return data.runwayUri
}

async function generate(payload){

    const response = await fetch(`${RUNWAY_API}/image_to_video`,{

        method:"POST",

        headers:{
            "Authorization":`Bearer ${RUNWAY_KEY}`,
            "X-Runway-Version":"2024-11-06",
            "Content-Type":"application/json"
        },

        body:JSON.stringify(payload)

    })

    const data = await response.json()

    return data
}

async function getTask(id){

    const response = await fetch(`${RUNWAY_API}/tasks/${id}`,{

        headers:{
            "Authorization":`Bearer ${RUNWAY_KEY}`,
            "X-Runway-Version":"2024-11-06"
        }

    })

    const data = await response.json()

    return data
}

module.exports = {
    upload,
    generate,
    getTask
}
