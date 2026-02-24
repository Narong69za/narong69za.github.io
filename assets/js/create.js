/* ===============================
STATE SYSTEM
================================ */

let STATE={
engine:null,
mode:null,
type:null
};

const typeBtns=document.querySelectorAll("[data-type]");
const modeBtns=document.querySelectorAll("[data-mode]");

const fileA=document.getElementById("fileA");
const fileB=document.getElementById("fileB");

const info=document.getElementById("model-info");
const hint=document.getElementById("requirement-hint");

const previewRedVideo=document.getElementById("preview-red-video");
const previewRedImage=document.getElementById("preview-red-image");

const previewBlueVideo=document.getElementById("preview-blue-video");
const previewBlueImage=document.getElementById("preview-blue-image");

const progressFill=document.getElementById("progress-fill");

const REQUIRE={
dark:"Prompt Only",
lipsync:"Video/Image + Audio",
motion:"Motion Video + Character",
face:"Image + Image"
};


/* ===============================
UI UPDATE
================================ */

function updateUI(){

info.innerText=
`ENGINE: ${STATE.engine||"-"} | MODE: ${STATE.mode||"-"} | TYPE: ${STATE.type||"-"}`;

hint.innerText=REQUIRE[STATE.mode]||"";

}


/* ===============================
ULTRA ACTIVE ENGINE VISUAL
================================ */

function setEngineActive(engine){

document.querySelectorAll(".engine")
.forEach(e=>e.classList.remove("engine-active"));

if(engine==="replicate"){
document.querySelector(".engine.red")
?.classList.add("engine-active");
}

if(engine==="runway"){
document.querySelector(".engine.blue")
?.classList.add("engine-active");
}

}


/* ===============================
TYPE SELECT
================================ */

typeBtns.forEach(btn=>{
btn.onclick=()=>{

typeBtns.forEach(b=>b.classList.remove("active"));

btn.classList.add("active");

STATE.type=btn.dataset.type;

updateUI();

};
});


/* ===============================
MODE SELECT (ENGINE + MODE)
================================ */

modeBtns.forEach(btn=>{

btn.onclick=()=>{

modeBtns.forEach(b=>b.classList.remove("active-mode"));

btn.classList.add("active-mode");

STATE.engine=btn.dataset.engine==="red"?"replicate":"runway";
STATE.mode=btn.dataset.mode;

setEngineActive(STATE.engine);

updateUI();

};

});


/* ===============================
PREVIEW SYSTEM
================================ */

function preview(file,targetVideo,targetImage){

targetVideo.style.display="none";
targetImage.style.display="none";

if(!file)return;

const url=URL.createObjectURL(file);

if(file.type.startsWith("video")){
targetVideo.src=url;
targetVideo.style.display="block";
}

if(file.type.startsWith("image")){
targetImage.src=url;
targetImage.style.display="block";
}

}

fileA.onchange=()=>{
preview(fileA.files[0],previewRedVideo,previewRedImage);
};

fileB.onchange=()=>{
preview(fileB.files[0],previewBlueVideo,previewBlueImage);
};


/* ===============================
GENERATE SIMULATION
================================ */

async function generate(engine){

document.getElementById("status").innerText="STATUS: PROCESSING";

let p=0;

const timer=setInterval(()=>{

p+=10;

progressFill.style.width=p+"%";

if(p>=100){

clearInterval(timer);

document.getElementById("status").innerText="STATUS: COMPLETE";

}

},300);

}

document.getElementById("generate-red").onclick=()=>generate("red");
document.getElementById("generate-blue").onclick=()=>generate("blue");


/* ===============================
AUTO LOAD FROM TEMPLATE (URL PARAM)
================================ */

const params=new URLSearchParams(window.location.search);

const autoEngine=params.get("engine");
const autoMode=params.get("mode");
const autoType=params.get("type");

if(autoEngine && autoMode){

STATE.engine=autoEngine;
STATE.mode=autoMode;
STATE.type=autoType || "video";

document.querySelector(
`[data-engine="${autoEngine==="replicate"?"red":"blue"}"][data-mode="${autoMode}"]`
)?.click();

document.querySelector(
`[data-type="${STATE.type}"]`
)?.click();

}
