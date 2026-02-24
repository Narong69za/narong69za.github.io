let STATE = { engine:null, mode:null, type:null };

const typeBtns = document.querySelectorAll("[data-type]");
const modeBtns = document.querySelectorAll("[data-mode]");

const info = document.getElementById("model-info");
const hint = document.getElementById("requirement-hint");

const fileA = document.getElementById("fileA");
const fileB = document.getElementById("fileB");

const previewVideoA = document.getElementById("previewA");
const previewImageA = document.getElementById("imageA");

const previewVideoB = document.getElementById("previewB");
const previewImageB = document.getElementById("imageB");

const costPreview = document.getElementById("cost-preview");

const COST_PER_SECOND = 2.2;
const MAX_DURATION = 30;

const REQUIRE = {
dark:"Prompt Only",
lipsync:"Video + Image OR Image + Audio",
motion:"Motion Video + Character",
face:"Image + Image",
upscale:"Single File"
};

function updatePreview(){
info.innerText =
`ENGINE: ${STATE.engine || "-"} | MODE: ${STATE.mode || "-"} | TYPE: ${STATE.type || "-"}`;
hint.innerText = REQUIRE[STATE.mode] || "";
}

typeBtns.forEach(btn=>{
btn.onclick=()=>{
typeBtns.forEach(b=>b.classList.remove("active"));
btn.classList.add("active");
STATE.type=btn.dataset.type;
updatePreview();
};
});

modeBtns.forEach(btn=>{
btn.onclick=()=>{
const engine=btn.dataset.engine;
document.querySelectorAll(`.engine.${engine} button[data-mode]`)
.forEach(b=>b.classList.remove("active-mode"));
btn.classList.add("active-mode");
STATE.engine=engine==="red"?"replicate":"runway";
STATE.mode=btn.dataset.mode;
updatePreview();
};
});

function renderPreview(file, videoEl, imageEl){
videoEl.style.display="none";
imageEl.style.display="none";
if(!file) return;
const url=URL.createObjectURL(file);
if(file.type.startsWith("video")){
videoEl.src=url;
videoEl.style.display="block";
}
if(file.type.startsWith("image")){
imageEl.src=url;
imageEl.style.display="block";
}
}

fileA.onchange=()=>{
renderPreview(fileA.files[0], previewVideoA, previewImageA);
detectCost(fileA.files[0]);
};

fileB.onchange=()=>{
renderPreview(fileB.files[0], previewVideoB, previewImageB);
};

function detectCost(file){
if(!file || !file.type.startsWith("video")) return;
const video=document.createElement("video");
video.preload="metadata";
video.onloadedmetadata=function(){
const duration=video.duration;
if(duration>MAX_DURATION){
alert("Video max 30 seconds");
fileA.value="";
return;
}
const cost=(duration*COST_PER_SECOND).toFixed(2);
costPreview.innerText=`DURATION: ${duration.toFixed(1)}s | COST: ${cost} บาท`;
};
video.src=URL.createObjectURL(file);
}

function validateFiles(){
if(!STATE.mode) return false;
if(STATE.mode==="dark") return true;
if(STATE.mode==="face") return fileA.files.length&&fileB.files.length;
if(STATE.mode==="motion") return fileA.files.length&&fileB.files.length;
if(STATE.mode==="lipsync") return fileA.files.length&&fileB.files.length;
return true;
}

async function generate(){
if(!validateFiles()){ alert("FILES MISSING"); return; }
document.getElementById("status").innerText="STATUS: PROCESSING";
const form=new FormData();
form.append("engine",STATE.engine);
form.append("mode",STATE.mode);
form.append("type",STATE.type);
if(fileA.files[0]) form.append("fileA",fileA.files[0]);
if(fileB.files[0]) form.append("fileB",fileB.files[0]);
await fetch("/api/render",{ method:"POST", body:form });
document.getElementById("status").innerText="STATUS: COMPLETE";
}

document.getElementById("generate-red").onclick=generate;
document.getElementById("generate-blue").onclick=generate;
