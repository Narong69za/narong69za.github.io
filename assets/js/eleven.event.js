/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: eleven.event.js
VERSION: v1.0.0
STATUS: EVENT DEMO

RESPONSIBILITY
- demo voice generation
- demo sound effect
- preview audio playback

===================================================== */

export async function previewVoice(text){

try{

const res=await fetch("/api/ai/eleven",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

model:"multilingual_v2",

payload:{
prompt:text
}

})

})

if(!res.ok){

throw new Error("voice generation failed")

}

const blob=await res.blob()

const url=URL.createObjectURL(blob)

const audio=new Audio(url)

audio.play()

return url

}catch(e){

console.error("EVENT VOICE ERROR",e)

}

}


export async function previewSound(prompt){

try{

const res=await fetch("/api/ai/eleven",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

model:"text_to_sound_v2",

payload:{
prompt:prompt,
duration:2
}

})

})

if(!res.ok){

throw new Error("sound generation failed")

}

const blob=await res.blob()

const url=URL.createObjectURL(blob)

const audio=new Audio(url)

audio.play()

return url

}catch(e){

console.error("EVENT SOUND ERROR",e)

}

}
