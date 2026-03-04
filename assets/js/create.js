/**
=====================================================
PROJECT: SN DESIGN STUDIO
MODULE: create.js
VERSION: v9.7.0
STATUS: production
FIX:
- connect CTA_MODEL_MASTER
- build payload correctly
- upload media support
- runway task polling
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

engine.querySelector(".credit-rate").innerText=
rate+" credits / sec"

}

function initEngines(){

document.querySelectorAll(".engine-box").forEach(engine=>{

const res=engine.querySelector(".engine-resolution")

if(res){

res.addEventListener("change",()=>updateCreditRate(engine))
updateCreditRate(engine)

}

})

/* FILE PREVIEW */

document.querySelectorAll(".engine-fileA")
.forEach(input=>{

input.addEventListener("change",(e)=>{

const engine=input.closest(".engine-box")
const preview=engine.querySelector(".engine-preview")

const file=e.target.files[0]
if(!file)return

const url=URL.createObjectURL(file)

if(file.type.startsWith("image")){

preview.innerHTML=`<img src="${url}" style="max-width:100%">`

}else if(file.type.startsWith("video")){

preview.innerHTML=`<video src="${url}" controls style="max-width:100%"></video>`

}else if(file.type.startsWith("audio")){

preview.innerHTML=`<audio src="${url}" controls></audio>`

}

})

})

/* GENERATE */

document.querySelectorAll(".generate-btn")
.forEach(btn=>{

btn.addEventListener("click",async()=>{

const engine=btn.closest(".engine-box")

const cta=engine.dataset.engine

const prompt=engine.querySelector(".engine-prompt")?.value

const resolution=engine.querySelector(".engine-resolution")?.value

const file=engine.querySelector(".engine-fileA")?.files[0]

document.getElementById("status").innerText="GENERATING..."

try{

let image=null
let video=null
let audio=null

if(file){

const upload=await uploadFile(file)

if(file.type.startsWith("image")) image=upload.runwayUri
if(file.type.startsWith("video")) video=upload.runwayUri
if(file.type.startsWith("audio")) audio=upload.runwayUri

}

const payload=buildPayload(cta,{
prompt,
image,
video,
audio,
ratio:"1280:720",
duration:5
})

const res=await fetch("/api/runway/generate",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(payload)
})

const task=await res.json()

const result=await pollTask(task.id)

logTask(result)

document.querySelector(".engine-preview").innerHTML=
`<video src="${result.output[0]}" controls style="max-width:100%">`

document.getElementById("status").innerText="RENDER COMPLETE"

}catch(e){

console.error(e)

document.getElementById("status").innerText="ERROR"

}

})

})

}

document.addEventListener("DOMContentLoaded",initEngines)
