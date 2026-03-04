/**
=====================================================
PROJECT: SN DESIGN STUDIO
MODULE: create.js
VERSION: v9.4.0
STATUS: production
RESPONSIBILITY:
- per-engine generation
- realtime credit calculation
- payload build
- engine execution
=====================================================
*/

const CREDIT_TABLE = {

720:5,
1080:10

}

function calculateCredits(engine){

const resolution=engine.querySelector(".engine-resolution")?.value

const length=engine.querySelector(".engine-length")?.value

if(!resolution||!length)return 0

return CREDIT_TABLE[resolution] * parseInt(length)

}

function updateCredit(engine){

const cost=calculateCredits(engine)

engine.querySelector(".credit-value").innerText=cost

}

document.querySelectorAll(".engine-box").forEach(engine=>{

const resolution=engine.querySelector(".engine-resolution")
const length=engine.querySelector(".engine-length")

if(resolution)resolution.addEventListener("change",()=>updateCredit(engine))

if(length)length.addEventListener("change",()=>updateCredit(engine))

})

document.querySelectorAll(".generate-btn").forEach(btn=>{

btn.addEventListener("click",async()=>{

const engine=btn.closest(".engine-box")

const model=engine.dataset.model
const type=engine.dataset.type

const prompt=engine.querySelector(".engine-prompt")?.value

const resolution=engine.querySelector(".engine-resolution")?.value

const length=engine.querySelector(".engine-length")?.value

const credits=calculateCredits(engine)

document.getElementById("status").innerText=
`GENERATING (${credits} credits)`

const payload={
model,
type,
prompt,
resolution,
length
}

try{

const built=PayloadBuilder.build(payload)

await UploadService.prepare(built)

const task=await RunwayEngine.run(built)

const result=await TaskPoller.wait(task)

RenderEngine.preview(result)

document.getElementById("status").innerText="RENDER COMPLETE"

}catch(err){

console.error(err)

document.getElementById("status").innerText="ERROR"

}

})

})
