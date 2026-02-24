/* =================================
STATE SYSTEM
================================= */

let STATE={
engine:null,
mode:null,
type:null
};

/* =================================
ELEMENTS
================================= */

const fileA=document.getElementById("fileA");
const fileB=document.getElementById("fileB");

const previewRedVideo=document.getElementById("preview-red-video");
const previewRedImage=document.getElementById("preview-red-image");

const previewBlueVideo=document.getElementById("preview-blue-video");
const previewBlueImage=document.getElementById("preview-blue-image");

const progressFill=document.getElementById("progress-fill");

const statusEl=document.getElementById("status");
const infoEl=document.getElementById("model-info");

/* =================================
PREVIEW SYSTEM
================================= */

function preview(file, videoEl, imageEl){

if(!file) return;

const url = URL.createObjectURL(file);

videoEl.style.display="none";
imageEl.style.display="none";

if(file.type.startsWith("video/")){
videoEl.src=url;
videoEl.style.display="block";
}

if(file.type.startsWith("image/")){
imageEl.src=url;
imageEl.style.display="block";
}

}

/* RED FILE */

fileA?.addEventListener("change",()=>{
preview(fileA.files[0],previewRedVideo,previewRedImage);
});

/* BLUE FILE */

fileB?.addEventListener("change",()=>{
preview(fileB.files[0],previewBlueVideo,previewBlueImage);
});

/* =================================
ENGINE ACTIVE GLOW
================================= */

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

/* =================================
MODE SELECT
================================= */

document.querySelectorAll("[data-mode]").forEach(btn=>{

btn.addEventListener("click",()=>{

document.querySelectorAll("[data-mode]")
.forEach(b=>b.classList.remove("active-mode"));

btn.classList.add("active-mode");

STATE.engine = btn.dataset.engine==="red" ? "replicate" : "runway";
STATE.mode = btn.dataset.mode;

setEngineActive(STATE.engine);

updateUI();

});

});

/* =================================
TYPE SELECT
================================= */

document.querySelectorAll("[data-type]").forEach(btn=>{

btn.addEventListener("click",()=>{

document.querySelectorAll("[data-type]")
.forEach(b=>b.classList.remove("active"));

btn.classList.add("active");

STATE.type = btn.dataset.type;

updateUI();

});

});

/* =================================
UI INFO UPDATE
================================= */

function updateUI(){

if(!infoEl) return;

infoEl.innerText =
`ENGINE: ${STATE.engine || "-"} | MODE: ${STATE.mode || "-"} | TYPE: ${STATE.type || "-"}`;

}

/* =================================
AUTO LOAD FROM TEMPLATE (URL PARAM)
================================= */

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

document.querySelector(`[data-type="${STATE.type}"]`)
?.click();

}

/* =================================
GENERATE MOCK PROCESS
================================= */

function generate(engine){

if(statusEl) statusEl.innerText="STATUS: PROCESSING";

let p=0;

const timer=setInterval(()=>{

p+=10;

if(progressFill)
progressFill.style.width=p+"%";

if(p>=100){

clearInterval(timer);

if(statusEl)
statusEl.innerText="STATUS: COMPLETE";

}

},300);

}

document.getElementById("generate-red")
?.addEventListener("click",()=>generate("red"));

document.getElementById("generate-blue")
?.addEventListener("click",()=>generate("blue"));
