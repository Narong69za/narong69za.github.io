/* ==========================================
SN DESIGN ENGINE AI
CREATE.JS — LOCK SAFE FINAL
========================================== */

/* ===============================
GLOBAL STATE
================================ */

let STATE={
engine:null,
model:null,
mode:null,
type:null
};

/* ===============================
ELEMENT SELECTORS
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

flux2pro:`
REPLICATE FLUX2PRO

Image generation
Variation / Style
Face swap

Output:
720p base
1080p upscale
`,

faceclone:`
REPLICATE FACELONE

Face replace
Image reference required

720p base
1080p upscale
`,

gen4video:`
RUNWAY GEN4 VIDEO

Motion clone
Image → Video
Lipsync / Dance motion

Max length: 30 sec
720p base
1080p upscale
`

};

/* ===============================
MODEL SELECT (ENGINE SAFE LOCK)
================================ */

modelBtns.forEach(btn=>{

btn.addEventListener("click",()=>{

/* isolate per engine */
const engineBox=btn.closest(".engine-box");

/* remove active from same engine only */
engineBox
.querySelectorAll("[data-model]")
.forEach(b=>b.classList.remove("active-model"));

btn.classList.add("active-model");

STATE.model=btn.dataset.model;

/* detect engine by parent class */
if(engineBox.classList.contains("red-engine")){
STATE.engine="replicate";
}
else if(engineBox.classList.contains("blue-engine")){
STATE.engine="runway";
}

/* update info panel safely */
if(engineInfo && MODEL_INFO[STATE.model]){
engineInfo.innerText=MODEL_INFO[STATE.model];
}

});

});

/* ===============================
MODE SELECT (ENGINE SCOPED)
================================ */

modeBtns.forEach(btn=>{

btn.addEventListener("click",()=>{

const engineBox=btn.closest(".engine-box");

/* remove active only inside same engine */
engineBox
.querySelectorAll("[data-mode]")
.forEach(b=>b.classList.remove("active-mode"));

btn.classList.add("active-mode");

STATE.mode=btn.dataset.mode;

});

});

/* ===============================
FILE PREVIEW (LOCKED VISUAL)
================================ */

function preview(file,videoEl,imageEl){

if(!file) return;

const url=URL.createObjectURL(file);

/* hide both first */
videoEl.style.display="none";
imageEl.style.display="none";

if(file.type.startsWith("video")){
videoEl.src=url;
videoEl.style.display="block";
}

if(file.type.startsWith("image")){
imageEl.src=url;
imageEl.style.display="block";
}

}

/* attach listeners safely */

if(fileA){
fileA.addEventListener("change",()=>{
preview(fileA.files[0],previewRedVideo,previewRedImage);
});
}

if(fileB){
fileB.addEventListener("change",()=>{
preview(fileB.files[0],previewBlueVideo,previewBlueImage);
});
}

/* ==========================================
END LOCK SAFE FINAL
========================================== */
