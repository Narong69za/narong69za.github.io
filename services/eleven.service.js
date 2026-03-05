/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: eleven.service.js
VERSION: v1.0.0
STATUS: production
LAYER: AI PROVIDER SERVICE

AUTHOR: SN DESIGN ENGINE SYSTEM
CREATED: 2026

RESPONSIBILITY:
- execute ElevenLabs voice generation
- handle text-to-speech
- handle speech-to-speech
- handle sound generation

SUPPORTED MODELS:
- multilingual_v2
- text_to_sound_v2
- sts_v2

ENV REQUIRED:
ELEVEN_API_KEY

ENDPOINT:
https://api.elevenlabs.io

===================================================== */

export async function runEleven(model,payload){

try{

let endpoint=""

if(model==="multilingual_v2"){

endpoint="https://api.elevenlabs.io/v1/text-to-speech"

}

if(model==="text_to_sound_v2"){

endpoint="https://api.elevenlabs.io/v1/sound-generation"

}

if(model==="sts_v2"){

endpoint="https://api.elevenlabs.io/v1/speech-to-speech"

}

const res=await fetch(endpoint,{

method:"POST",

headers:{
"xi-api-key":process.env.ELEVEN_API_KEY,
"Content-Type":"application/json"
},

body:JSON.stringify({
text:payload.prompt,
audio:payload.audio||null
})

})

if(!res.ok){
throw new Error("ElevenLabs API error")
}

const data=await res.json()

return data

}catch(e){

console.error("ELEVEN SERVICE ERROR",e)

throw e

}

}
