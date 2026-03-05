/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: gemini.service.js
VERSION: v1.0.0
STATUS: production
LAYER: AI PROVIDER SERVICE

AUTHOR: SN DESIGN ENGINE SYSTEM
CREATED: 2026

RESPONSIBILITY:
- execute Gemini image generation
- handle prompt input
- return generated media

SUPPORTED MODELS:
- gemini-2.5-flash

ENV REQUIRED:
GEMINI_API_KEY

ENDPOINT:
https://generativelanguage.googleapis.com

===================================================== */

export async function runGemini(model,payload){

try{

const endpoint=
`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`

const res=await fetch(endpoint,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

contents:[
{
parts:[
{
text:payload.prompt
}
]
}
]

})

})

if(!res.ok){
throw new Error("Gemini API error")
}

const data=await res.json()

return data

}catch(e){

console.error("GEMINI SERVICE ERROR",e)

throw e

}

}
