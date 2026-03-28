/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: endpoint.router.js
VERSION: v10.0.0
STATUS: production
LAYER: ENGINE ROUTER

RESPONSIBILITY:
- route ENGINE 1-14
- call correct provider API
- return result

DEPENDENCIES:
- engine.data.js

===================================================== */

import {ENGINE_DATA} from "./engine.data.js"

export async function routeEngine(engineId,payload){

const engine=ENGINE_DATA[engineId]

if(!engine){
throw new Error("ENGINE NOT FOUND")
}

const provider=engine.provider
const endpoint=engine.endpoint
const model=engine.model

/* ================= RUNWAY ================= */

if(provider==="runway"){

const res=await fetch("/api/runway/generate",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
model,
endpoint,
payload
})

})

if(!res.ok){
throw new Error("RUNWAY GENERATE FAILED")
}

return await res.json()

}

/* ================= REPLICATE ================= */

if(provider==="replicate"){

const res=await fetch("https://api.replicate.com/v1/predictions",{

method:"POST",

headers:{
"Authorization":"Token "+window.REPLICATE_API_TOKEN,
"Content-Type":"application/json"
},

body:JSON.stringify({
version:model,
input:payload
})

})

if(!res.ok){
throw new Error("REPLICATE GENERATE FAILED")
}

return await res.json()

}

/* ================= GEMINI ================= */

if(provider==="gemini"){

const res=await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${window.GEMINI_API_KEY}`,
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
contents:[
{
parts:[
{text:payload.prompt}
]
}
]
})

})

if(!res.ok){
throw new Error("GEMINI GENERATE FAILED")
}

return await res.json()

}

/* ================= ELEVENLABS ================= */

if(provider==="elevenlabs"){

let api=""

if(model==="multilingual_v2"){
api="https://api.elevenlabs.io/v1/text-to-speech"
}

if(model==="text_to_sound_v2"){
api="https://api.elevenlabs.io/v1/sound-generation"
}

if(model==="sts_v2"){
api="https://api.elevenlabs.io/v1/speech-to-speech"
}

const res=await fetch(api,{

method:"POST",

headers:{
"xi-api-key":window.ELEVEN_API_KEY,
"Content-Type":"application/json"
},

body:JSON.stringify(payload)

})

if(!res.ok){
throw new Error("ELEVENLABS GENERATE FAILED")
}

return await res.json()

}

throw new Error("UNSUPPORTED PROVIDER")

    }
