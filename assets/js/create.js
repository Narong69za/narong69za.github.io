/**
=====================================================
PROJECT: SN DESIGN STUDIO
MODULE: create.js
VERSION: v9.4.1
STATUS: production
RESPONSIBILITY:
- CTA engine router
- realtime credit rate preview
- generation payload
=====================================================
*/

const CREDIT_RATE = {

720:2,
1080:4

}

function updateCreditRate(engine){

const resolution=engine.querySelector(".engine-resolution")?.value

if(!resolution)return

const rate=CREDIT_RATE[resolution]

engine.querySelector(".credit-rate").innerText=
rate+" credits / sec"

}

document.querySelectorAll(".engine-box").forEach(engine=>{

const resolution=engine.querySelector(".engine-resolution")

if(resolution){

resolution.addEventListener("change",()=>{

updateCreditRate(engine)

})

updateCreditRate(engine)

}

})

document.querySelectorAll(".generate-btn").forEach(btn=>{

btn.addEventListener("click",async()=>{

const engine=btn.closest(".engine-box")

const model=engine.dataset.model

const prompt=engine.querySelector(".engine-prompt")?.value

const resolution=engine.querySelector(".engine-resolution")?.value

const payload={

model,
prompt,
resolution

}

document.getElementById("status").innerText="GENERATING..."

try{

const built=PayloadBuilder.build(payload)

await UploadService.prepare(built)

const task=await RunwayEngine.run(built)

const result=await TaskPoller.wait(task)

RenderEngine.preview(result)

document.getElementById("status").innerText="RENDER COMPLETE"

}catch(e){

console.error(e)

document.getElementById("status").innerText="ERROR"

}

})

})
