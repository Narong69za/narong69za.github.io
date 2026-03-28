/**
=====================================================
PROJECT: SN DESIGN STUDIO
MODULE: create.js
VERSION: v9.9.0
STATUS: production-final
FIX:
- corrected API endpoint (/api/render)
- stable engine UI 1-14
- safe file preview
- stable payload builder
- safe DOM handling
=====================================================
*/

import {buildPayload} from "./payload.builder.js"
import {pollTask} from "./task.poller.js"
import {uploadFile} from "./upload.service.js"
import {logTask} from "./db.logger.js"

const CREDIT_RATE={
720:2,
1080:4
}

function updateCreditRate(engine){

const res=engine.querySelector(".engine-resolution")

if(!res)return

const rate=CREDIT_RATE[res.value]||0

const credit=engine.querySelector(".credit-rate")

if(credit){
credit.innerText=rate+" credits / sec"
}

}

function initEngines(){

const engines=document.querySelectorAll(".engine-box")

engines.forEach(engine=>{

const res=engine.querySelector(".engine-resolution")

if(res){

res.addEventListener("change",()=>{
updateCreditRate(engine)
})

updateCreditRate(engine)

}

})

/* FILE PREVIEW */

document.querySelectorAll(".engine-fileA")
.forEach(input=>{

input.addEventListener("change",(e)=>{

const engine=input.closest(".engine-box")

if(!engine)return

const preview=engine.querySelector(".engine-preview")

if(!preview)return

const file=e.target.files[0]

if(!file)return

const url=URL.createObjectURL(file)

if(file.type.startsWith("image")){

preview.innerHTML=
`<img src="${url}" style="max-width:100%">`

}

else if(file.type.startsWith("video")){

preview.innerHTML=
`<video src="${url}" controls style="max-width:100%"></video>`

}

else if(file.type.startsWith("audio")){

preview.innerHTML=
`<audio src="${url}" controls></audio>`

}

})

})

/* GENERATE ENGINE */

document.querySelectorAll(".generate-btn")
.forEach(btn=>{

btn.addEventListener("click",async()=>{

const engine=btn.closest(".engine-box")

if(!engine)return

const cta=engine.dataset.engine

const prompt=engine.querySelector(".engine-prompt")?.value||""

const resolution=engine.querySelector(".engine-resolution")?.value||"720"

const file=engine.querySelector(".engine-fileA")?.files?.[0]||null

const preview=engine.querySelector(".engine-preview")

const status=document.getElementById("status")

if(status){
status.innerText="GENERATING..."
}

try{

let image=null
let video=null
let audio=null

/* upload media */

if(file){

const upload=await uploadFile(file)

if(file.type.startsWith("image")){
image=upload.runwayUri || upload.url
}

if(file.type.startsWith("video")){
video=upload.runwayUri || upload.url
}

if(file.type.startsWith("audio")){
audio=upload.runwayUri || upload.url
}

}

/* build payload */

const payload=buildPayload(cta,{
prompt,
image,
video,
audio,
ratio:"1280:720",
duration:5
})

/* generate */

const res=await fetch(${API_BASE}/api/render, {

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(payload)

})

if(!res.ok){

throw new Error("API GENERATE FAILED")

}

const task=await res.json()

/* poll */

const result=await pollTask(task.id)

logTask(result)

/* render preview */

if(preview){

const output=result?.output?.[0]

if(!output)return

if(output.endsWith(".mp4")){

preview.innerHTML=
`<video src="${output}" controls style="max-width:100%"></video>`

}

else if(
output.endsWith(".png")||
output.endsWith(".jpg")||
output.endsWith(".jpeg")
){

preview.innerHTML=
`<img src="${output}" style="max-width:100%">`

}

else if(
output.endsWith(".mp3")||
output.endsWith(".wav")
){

preview.innerHTML=
`<audio src="${output}" controls></audio>`

}

}

if(status){
status.innerText="RENDER COMPLETE"
}

}catch(e){

console.error(e)

if(status){
status.innerText="ERROR"
}

}

})

})

}

document.addEventListener("DOMContentLoaded",initEngines)
