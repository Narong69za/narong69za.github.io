/**
=====================================================
PROJECT: SN DESIGN STUDIO
MODULE: create.js
VERSION: v9.6.0
STATUS: production
=====================================================
*/

const CREDIT_RATE = {
720:2,
1080:4
}


function updateCreditRate(engine){

const resolution =
engine.querySelector(".engine-resolution").value

const rate =
CREDIT_RATE[resolution] || 0

engine.querySelector(".credit-rate")
.innerText = rate + " credits / sec"

}


function initEngines(){

document.querySelectorAll(".engine-box")
.forEach(engine=>{

const res =
engine.querySelector(".engine-resolution")

res.addEventListener("change",()=>{

updateCreditRate(engine)

})

updateCreditRate(engine)

})



document.querySelectorAll(".engine-fileA")
.forEach(input=>{

input.addEventListener("change",(e)=>{

const engine =
input.closest(".engine-box")

const preview =
engine.querySelector(".engine-preview")

const file = e.target.files[0]

if(!file) return

const url =
URL.createObjectURL(file)

if(file.type.startsWith("image")){

preview.innerHTML =
`<img src="${url}" style="max-width:100%">`

}

else if(file.type.startsWith("video")){

preview.innerHTML =
`<video src="${url}" controls style="max-width:100%"></video>`

}

else if(file.type.startsWith("audio")){

preview.innerHTML =
`<audio src="${url}" controls></audio>`

}

})

})


document.querySelectorAll(".generate-btn")
.forEach(btn=>{

btn.addEventListener("click",async()=>{

const engine =
btn.closest(".engine-box")

const prompt =
engine.querySelector(".engine-prompt").value

const resolution =
engine.querySelector(".engine-resolution").value

const file =
engine.querySelector(".engine-fileA").files[0]


const payload = new FormData()

payload.append("prompt",prompt)
payload.append("resolution",resolution)

if(file){

payload.append("file",file)

}

document.getElementById("status")
.innerText = "GENERATING..."


try{

const built =
PayloadBuilder.build(payload)

await UploadService.prepare(built)

const task =
await RunwayEngine.run(built)

const result =
await TaskPoller.wait(task)

RenderEngine.preview(result)

document.getElementById("status")
.innerText = "RENDER COMPLETE"

}catch(e){

console.error(e)

document.getElementById("status")
.innerText = "ERROR"

}

})

})

}

document.addEventListener(
"DOMContentLoaded",
initEngines
)
