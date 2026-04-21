/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: services/runway.service.js
VERSION: v1.1.0
STATUS: production
===================================================== */

const fetch=require("node-fetch")

const RUNWAY_API="https://api.dev.runwayml.com/v1"
const RUNWAY_KEY=process.env.RUNWAY_API_KEY

async function upload(){

const response=await fetch(`${RUNWAY_API}/uploads`,{

method:"POST",

headers:{
x-session-id:`Bearer ${RUNWAY_KEY}`,
"X-Runway-Version":"2024-11-06",
"Content-Type":"application/json"
},

body:JSON.stringify({
filename:"upload.file",
type:"ephemeral"
})

})

const data=await response.json()

return data.runwayUri

}

async function generate(payload){

const endpoint=payload.endpoint

delete payload.endpoint

const response=await fetch(`${RUNWAY_API}${endpoint}`,{

method:"POST",

headers:{
x-session-id:`Bearer ${RUNWAY_KEY}`,
"X-Runway-Version":"2024-11-06",
"Content-Type":"application/json"
},

body:JSON.stringify(payload)

})

return await response.json()

}

async function getTask(id){

const response=await fetch(`${RUNWAY_API}/tasks/${id}`,{

headers:{
x-session-id:`Bearer ${RUNWAY_KEY}`,
"X-Runway-Version":"2024-11-06"
}

})

return await response.json()

}

module.exports={
upload,
generate,
getTask
}
