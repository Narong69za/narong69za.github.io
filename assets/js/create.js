/* =====================================================
SN DESIGN ENGINE AI
CREATE.JS — FINAL STABLE BUILD
(UI LOCK SAFE VERSION)
===================================================== */


document.addEventListener("DOMContentLoaded",()=>{


/* ===============================
STATE
=============================== */

let STATE = {
engine:null,
model:null,
mode:null,
type:null
};


/* ===============================
DOM
=============================== */

const fileA = document.getElementById("fileA");
const fileB = document.getElementById("fileB");

const previewRedVideo = document.getElementById("preview-red-video");
const previewRedImage = document.getElementById("preview-red-image");

const previewBlueVideo = document.getElementById("preview-blue-video");
const previewBlueImage = document.getElementById("preview-blue-image");

const info = document.getElementById("model-info");


/* ===============================
UPDATE STATUS
=============================== */

function updateUI(){

if(!info) return;

info.innerText =
`ENGINE: ${STATE.engine||"-"} | MODEL: ${STATE.model||"-"} | MODE: ${STATE.mode||"-"} | TYPE: ${STATE.type||"-"}`;

}


/* ===============================
ENGINE MODEL SELECT
=============================== */

document.querySelectorAll(".engine button").forEach(btn=>{

btn.addEventListener("click",()=>{

/* remove active glow */
document.querySelectorAll(".engine button")
.forEach(b=>b.classList.remove("active"));

btn.classList.add("active");

/* detect engine */
const engineBox = btn.closest(".engine");

if(engineBox.classList.contains("red")){
STATE.engine="replicate";
}

if(engineBox.classList.contains("blue")){
STATE.engine="runway";
}

STATE.model = btn.innerText.trim();

updateUI();

});

});


/* ===============================
FILE PREVIEW
=============================== */

function preview(file, videoEl, imageEl){

if(!file) return;

const url = URL.createObjectURL(file);

if(videoEl){
videoEl.pause?.();
videoEl.style.display="none";
}

if(imageEl){
imageEl.style.display="none";
}

if(file.type.startsWith("video/") && videoEl){

videoEl.src = url;
videoEl.load();
videoEl.style.display="block";

}

if(file.type.startsWith("image/") && imageEl){

imageEl.src = url;
imageEl.style.display="block";

}

}


/* listeners */

if(fileA){

fileA.addEventListener("change",()=>{

preview(
fileA.files[0],
previewRedVideo,
previewRedImage
);

});

}

if(fileB){

fileB.addEventListener("change",()=>{

preview(
fileB.files[0],
previewBlueVideo,
previewBlueImage
);

});

}


/* ===============================
TYPE SELECT
=============================== */

document.querySelectorAll("[data-type]").forEach(btn=>{

btn.addEventListener("click",()=>{

document.querySelectorAll("[data-type]")
.forEach(b=>b.classList.remove("active"));

btn.classList.add("active");

STATE.type = btn.dataset.type;

updateUI();

});

});


updateUI();

});
