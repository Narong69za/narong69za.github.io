let STATE = {
engine:null,
mode:null,
type:null
};

const typeBtns = document.querySelectorAll("[data-type]");
const modeBtns = document.querySelectorAll("[data-mode]");

const info = document.getElementById("model-info");
const hint = document.getElementById("requirement-hint");

const fileA = document.getElementById("fileA");
const fileB = document.getElementById("fileB");

const previewVideo = document.getElementById("preview-video");
const previewImage = document.getElementById("preview-image");

/* ======================
MODEL REQUIRE MATRIX
====================== */

const REQUIRE = {

dark: "Prompt Only",

lipsync:
"Video + Image OR Image + Audio OR Video + Audio",

motion:
"Character(Image/Video) + Motion Video",

face:
"Image + Image",

upscale:
"Single File"

};

function updatePreview(){

info.innerText =
`ENGINE: ${STATE.engine || "-"} | MODE: ${STATE.mode || "-"} | TYPE: ${STATE.type || "-"}`;

if(hint){
hint.innerText = REQUIRE[STATE.mode] || "";
}

}

/* ======================
TYPE SELECT
====================== */

typeBtns.forEach(btn=>{

btn.onclick = ()=>{

typeBtns.forEach(b=>b.classList.remove("active"));
btn.classList.add("active");

STATE.type = btn.dataset.type;

updatePreview();

};

});

/* ======================
MODE SELECT
====================== */

modeBtns.forEach(btn=>{

btn.onclick = ()=>{

const engine = btn.dataset.engine;

document.querySelectorAll(`.engine.${engine} button[data-mode]`)
.forEach(b=>b.classList.remove("active-mode"));

btn.classList.add("active-mode");

STATE.engine = engine === "red" ? "replicate" : "runway";

STATE.mode = btn.dataset.mode;

updatePreview();

};

});

/* ======================
PREVIEW SYSTEM (ADD ONLY SAFE)
====================== */

function previewFile(file){

if(!previewVideo || !previewImage) return;

previewVideo.style.display="none";
previewImage.style.display="none";

if(!file) return;

const url = URL.createObjectURL(file);

if(file.type.startsWith("video")){
previewVideo.src = url;
previewVideo.style.display="block";
}

if(file.type.startsWith("image")){
previewImage.src = url;
previewImage.style.display="block";
}

}

if(fileA){
fileA.onchange = ()=> previewFile(fileA.files[0]);
}

if(fileB){
fileB.onchange = ()=> previewFile(fileB.files[0]);
}

/* ======================
VALIDATION MATRIX (FIXED)
====================== */

function validateFiles(){

if(!STATE.mode) return false;

if(STATE.mode==="dark") return true;

/* face swap requires 2 images */
if(STATE.mode==="face")
return fileA.files.length && fileB.files.length;

/* motion control requires video + character */
if(STATE.mode==="motion")
return fileA.files.length && fileB.files.length;

/* lipsync requires source + target */
if(STATE.mode==="lipsync")
return fileA.files.length && fileB.files.length;

if(STATE.type==="upscale")
return fileA.files.length;

return true;

}

/* ======================
GENERATE
====================== */

async function generate(engine){

if(!validateFiles()){
alert("FILES MISSING");
return;
}

document.getElementById("status").innerText="STATUS: PROCESSING";

const form = new FormData();

form.append("engine",STATE.engine);
form.append("mode",STATE.mode);
form.append("type",STATE.type);

if(fileA.files[0]) form.append("fileA",fileA.files[0]);
if(fileB.files[0]) form.append("fileB",fileB.files[0]);

await fetch("/api/render",{
method:"POST",
body:form
});

document.getElementById("status").innerText="STATUS: COMPLETE";

}

document.getElementById("generate-red").onclick=()=>generate("red");
document.getElementById("generate-blue").onclick=()=>generate("blue");

/* ===================================
ULTRA STEP 1 — VIDEO META DETECT
ADD ONLY (NO UI CHANGE)
=================================== */

const COST_PER_SECOND = 2.2;
const MAX_DURATION = 30;

const costPreview = document.createElement("div");
costPreview.id = "cost-preview";

const modelPreviewBox = document.querySelector(".model-preview");

if(modelPreviewBox){
modelPreviewBox.appendChild(costPreview);
}

if(fileA){
fileA.addEventListener("change", handleVideoMeta);
}

function handleVideoMeta(){

if(!fileA.files.length) return;

const file = fileA.files[0];

if(!file.type.startsWith("video")) return;

const video = document.createElement("video");

video.preload = "metadata";

video.onloadedmetadata = function(){

const duration = video.duration;

/* prevent memory leak */
URL.revokeObjectURL(video.src);

if(duration > MAX_DURATION){

alert("Video max 30 seconds");

fileA.value = "";

return;

}

const cost = (duration * COST_PER_SECOND).toFixed(2);

costPreview.innerText =
`DURATION: ${duration.toFixed(1)}s | COST: ${cost} บาท`;

};

video.src = URL.createObjectURL(file);

  }

/* ==================================================
ULTRA FIX — DUAL PREVIEW ENGINE (ADD ONLY)
================================================== */

(function(){

/* หา container เดิม (ไม่แตะ UI layout) */

const previewContainer = document.querySelector(".model-preview");

if(!previewContainer) return;

/* สร้าง slot preview แยก (dynamic add only) */

const slotWrap = document.createElement("div");
slotWrap.style.display = "flex";
slotWrap.style.gap = "10px";
slotWrap.style.marginTop = "10px";
slotWrap.style.justifyContent = "center";
slotWrap.style.flexWrap = "wrap";

/* SLOT A (LEFT) */

const slotA = document.createElement("div");
slotA.style.maxWidth = "48%";

const videoA = document.createElement("video");
videoA.controls = true;
videoA.style.width = "100%";
videoA.style.display = "none";

const imageA = document.createElement("img");
imageA.style.width = "100%";
imageA.style.display = "none";

slotA.appendChild(videoA);
slotA.appendChild(imageA);

/* SLOT B (RIGHT) */

const slotB = document.createElement("div");
slotB.style.maxWidth = "48%";

const videoB = document.createElement("video");
videoB.controls = true;
videoB.style.width = "100%";
videoB.style.display = "none";

const imageB = document.createElement("img");
imageB.style.width = "100%";
imageB.style.display = "none";

slotB.appendChild(videoB);
slotB.appendChild(imageB);

/* inject */

slotWrap.appendChild(slotA);
slotWrap.appendChild(slotB);

previewContainer.appendChild(slotWrap);

/* preview handler */

function previewSlot(file, videoEl, imageEl){

videoEl.style.display="none";
imageEl.style.display="none";

if(!file) return;

const url = URL.createObjectURL(file);

if(file.type.startsWith("video")){
videoEl.src = url;
videoEl.style.display="block";
}

if(file.type.startsWith("image")){
imageEl.src = url;
imageEl.style.display="block";
}

}

/* bind file input */

if(fileA){
fileA.addEventListener("change", ()=>{
previewSlot(fileA.files[0], videoA, imageA);
});
}

if(fileB){
fileB.addEventListener("change", ()=>{
previewSlot(fileB.files[0], videoB, imageB);
});
}

})();
