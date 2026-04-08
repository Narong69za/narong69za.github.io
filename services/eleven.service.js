/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: eleven.service.js
VERSION: v2.0.0
STATUS: production
LAYER: AI PROVIDER SERVICE

RESPONSIBILITY:
- ElevenLabs API execution
- Text → Speech
- Speech → Speech
- Sound Effects generation

SUPPORTED MODELS
- multilingual_v2
- text_to_sound_v2
- sts_v2

ENV REQUIRED
ELEVENLABS_API_KEY

===================================================== */

const ELEVEN_API="https://api.elevenlabs.io/v1"

export async function runEleven(model,payload){

try{

let endpoint=""
let body={}

if(model==="multilingual_v2"){

const voice=payload.voice||"JBFqnCBsd6RMkjVDRZzb"

endpoint=`${ELEVEN_API}/text-to-speech/${voice}`

body={
text:payload.prompt,
model_id:"eleven_multilingual_v2",
output_format:"mp3_44100_128"
}

}

if(model==="text_to_sound_v2"){

endpoint=`${ELEVEN_API}/sound-effects/generate`

body={
text:payload.prompt,
duration_seconds:payload.duration||2
}

}

if(model==="sts_v2"){

const voice=payload.voice||"JBFqnCBsd6RMkjVDRZzb"

endpoint=`${ELEVEN_API}/speech-to-speech/${voice}`

body={
audio:payload.audio
}

}

const res=await fetch(endpoint,{
method:"POST",
headers:{
"xi-api-key":process.env.ELEVENLABS_API_KEY,
"Content-Type":"application/json"
},
body:JSON.stringify(body)
})

if(!res.ok){

const err=await res.text()
throw new Error(`ELEVENLABS_ERROR: ${err}`)

}

const buffer=await res.arrayBuffer()

return Buffer.from(buffer)

}catch(e){

console.error("ELEVEN SERVICE ERROR")
console.error(e)

throw e

}

}
