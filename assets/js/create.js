/* ===============================
STATE
================================ */

let STATE={
engine:null,
model:null,
mode:null,
type:null
};

/* ===============================
ELEMENTS
================================ */

const modelBtns=document.querySelectorAll("[data-model]");
const modeBtns=document.querySelectorAll("[data-mode]");

const fileA=document.getElementById("fileA");
const fileB=document.getElementById("fileB");

const previewRedVideo=document.getElementById("preview-red-video");
const previewRedImage=document.getElementById("preview-red-image");

const previewBlueVideo=document.getElementById("preview-blue-video");
const previewBlueImage=document.getElementById("preview-blue-image");

const engineInfo=document.getElementById("engine-info");

/* ===============================
MODEL INFO DATABASE
================================ */

const MODEL_INFO={

gen4video:`
RUNWAY GEN4 VIDEO

Motion clone
Image → Video
Lipsync / Dance motion

Max length: 30 sec
720p base (Upscale → 1080p)
`,

flux2pro:`
REPLICATE FLUX2PRO

Image generation
Variation
Face swap
Style transfer

720p / 1080p upscale
`

};

/* ===============================
MODEL SELECT (LOCK ENGINE CORE)
================================ */

modelBtns.forEach(btn=>{

btn.onclick=()=>{

/* remove active from all */
modelBtns.forEach(b=>b.classList.remove("active-model"));

btn.classList.add("active-model");

STATE.model=btn.dataset.model;

STATE.engine=
btn.closest(".red-engine") ? "replicate" : "runway";

/* update info box */

if(engineInfo && MODEL_INFO[STATE.model]){

engineInfo.innerText=MODEL_INFO[STATE.model];

}

};

});

/* ===============================
MODE SELECT
================================ */

modeBtns.forEach(btn=>{

btn.onclick=()=>{

modeBtns.forEach(b=>b.classList.remove("active-mode"));

btn.classList.add("active-mode");

STATE.mode=btn.dataset.mode;

};

});

/* ===============================
FILE PREVIEW (LOCKED VISUAL)
================================ */

function preview(file,videoEl,imageEl){

if(!file) return;

const url=URL.createObjectURL(file);

if(file.type.startsWith("video")){

videoEl.src=url;
videoEl.style.display="block";
imageEl.style.display="none";

}

else if(file.type.startsWith("image")){

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
