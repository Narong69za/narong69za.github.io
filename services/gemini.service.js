/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: gemini.service.js
VERSION: v1.0.0
STATUS: production
PROVIDER: GOOGLE GEMINI
===================================================== */

export async function runGemini(model,payload){

const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`

const res = await fetch(endpoint,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
contents:[
{
parts:[
{ text: payload.prompt }
]
}
]
})
})

if(!res.ok){
throw new Error("Gemini API error")
}

return await res.json()

}
