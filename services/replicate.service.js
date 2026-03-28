/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: replicate.service.js
VERSION: v1.0.0
STATUS: production
LAYER: AI PROVIDER SERVICE

AUTHOR: SN DESIGN ENGINE SYSTEM
CREATED: 2026

RESPONSIBILITY:
- execute Replicate API models
- handle prediction creation
- return output URL

SUPPORTED MODELS:
- black-forest-labs/flux-1.1-pro
- black-forest-labs/flux-schnell
- black-forest-labs/flux-redux

ENV REQUIRED:
REPLICATE_API_TOKEN

ENDPOINT:
https://api.replicate.com/v1/predictions

===================================================== */

export async function runReplicate(model,payload){

try{

const res=await fetch(
"https://api.replicate.com/v1/predictions",
{
method:"POST",
headers:{
"Authorization":"Token "+process.env.REPLICATE_API_TOKEN,
"Content-Type":"application/json"
},
body:JSON.stringify({
version:model,
input:{
prompt:payload.prompt,
image:payload.image||null,
aspect_ratio:payload.ratio||"16:9"
}
})
})

if(!res.ok){
throw new Error("Replicate API error")
}

const data=await res.json()

return data

}catch(e){

console.error("REPLICATE SERVICE ERROR",e)

throw e

}

}
