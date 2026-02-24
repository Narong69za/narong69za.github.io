/* ===============================
ULTRA ENGINE CORE LOCK
================================ */

let STATE={
engine:null,
model:null,
mode:null,
type:"video"
};

/* ===============================
ELEMENTS
================================ */

const fileA=document.getElementById("fileA");
const fileB=document.getElementById("fileB");

const previewRedVideo=document.getElementById("preview-red-video");
const previewRedImage=document.getElementById("preview-red-image");

const previewBlueVideo=document.getElementById("preview-blue-video");
const previewBlueImage=document.getElementById("preview-blue-image");

const infoBox=document.getElementById("engine-info");

/* ===============================
MODEL REQUIREMENTS
================================ */

const MODEL_INFO={

flux2pro:{
engine:"replicate",
text:`REPLICATE FLUX2PRO
Image generation
Variation / Style / Face swap
Output: 720p base (Upscale → 1080p)`
},

gen4video:{
engine:"runway",
text:`RUNWAY GEN4 VIDEO
Motion clone
Image → Video
Lipsync / Dance motion
Max length: 30 sec
720p base (Upscale → 1080p)`
}

};

/* ===============================
ACTIVE SELECT SYSTEM
================================ */

document.querySelectorAll("[data-model]").forEach(btn=>{

btn.onclick=()=>{

// clear ALL active
document.querySelectorAll("[data-model]")
.forEach(b=>b.classList.remove("active-select"));

// apply
btn.classList.add("active-select");

STATE.model=btn.dataset.model;
STATE.engine=MODEL_INFO[STATE.model].engine;

// show info
if(infoBox){
infoBox.innerText=MODEL_INFO[STATE.model].text;
}

};

});

document.querySelectorAll("[data-mode]").forEach(btn=>{

btn.onclick=()=>{

document.querySelectorAll("[data-mode]")
.forEach(b=>b.classList.remove("active-select"));

btn.classList.add("active-select");

STATE.mode=btn.dataset.mode;

};

});

/* ===============================
PREVIEW SYSTEM (LOCKED)
================================ */

function preview(file, videoEl, imageEl){

if(!file) return;

const url=URL.createObjectURL(file);

if(file.type.startsWith("video/")){
videoEl.src=url;
videoEl.style.display="block";
imageEl.style.display="none";
}

else if(file.type.startsWith("image/")){
imageEl.src=url;
imageEl.style.display="block";
videoEl.style.display="none";
}

}

fileA?.addEventListener("change",()=>{
preview(fileA.files[0],previewRedVideo,previewRedImage);
});

fileB?.addEventListener("change",()=>{
preview(fileB.files[0],previewBlueVideo,previewBlueImage);
});
