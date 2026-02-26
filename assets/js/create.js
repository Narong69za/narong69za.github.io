/* =====================================================
SN DESIGN ENGINE AI
create.js — FINAL ENGINE CORE
LOCK UI LAYOUT / PATCH STATE ONLY
===================================================== */


/* ===============================
STATE SYSTEM
=============================== */

let STATE = {
engine: null,
model: null,
mode: null,
type: null
};


/* ===============================
DOM REFERENCES
=============================== */

const fileA = document.getElementById("fileA");
const fileB = document.getElementById("fileB");

const previewRedVideo = document.getElementById("preview-red-video");
const previewRedImage = document.getElementById("preview-red-image");

const previewBlueVideo = document.getElementById("preview-blue-video");
const previewBlueImage = document.getElementById("preview-blue-image");

const progressFill = document.getElementById("progress-fill");

const info = document.getElementById("model-info");


/* ===============================
UPDATE UI STATUS
=============================== */

function updateUI(){

if(!info) return;

info.innerText =
`ENGINE: ${STATE.engine || "-"} | MODEL: ${STATE.model || "-"} | MODE: ${STATE.mode || "-"} | TYPE: ${STATE.type || "-"}`;

}


/* ===============================
ENGINE MODEL SELECT (FINAL LOCK)
=============================== */

document.querySelectorAll("[data-engine-model]").forEach(btn=>{

btn.addEventListener("click",()=>{

const engine = btn.dataset.engine;
const model = btn.dataset.model;

/* remove active only inside same engine */

document.querySelectorAll(
`[data-engine-model][data-engine="${engine}"]`
).forEach(b=>b.classList.remove("active"));

btn.classList.add("active");

/* prevent dual engine active */

document.querySelectorAll(
`[data-engine-model]:not([data-engine="${engine}"])`
).forEach(b=>b.classList.remove("active"));

STATE.engine = engine;
STATE.model = model;

updateUI();

});

});


/* ===============================
MODE SELECT
=============================== */

document.querySelectorAll("[data-mode]").forEach(btn=>{

btn.addEventListener("click",()=>{

document.querySelectorAll(
`[data-mode][data-engine="${btn.dataset.engine}"]`
).forEach(b=>b.classList.remove("active"));

btn.classList.add("active");

STATE.mode = btn.dataset.mode;

updateUI();

});

});


/* ===============================
TYPE SELECT
=============================== */

document.querySelectorAll("[data-type]").forEach(btn=>{

btn.addEventListener("click",()=>{

document.querySelectorAll("[data-type]").forEach(b=>b.classList.remove("active"));

btn.classList.add("active");

STATE.type = btn.dataset.type;

updateUI();

});

});


/* ===============================
FILE PREVIEW SYSTEM (FINAL FIX)
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

else if(file.type.startsWith("image/") && imageEl){

imageEl.src = url;
imageEl.style.display="block";

}

}


/* FILE INPUT LISTENER */

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
GENERATE SIMULATION (UI ONLY)
=============================== */

async function generate(engine){

const status = document.getElementById("status");

if(status){
status.innerText="STATUS: PROCESSING";
}

let p = 0;

const timer = setInterval(()=>{

p += 10;

if(progressFill){
progressFill.style.width = p + "%";
}

if(p>=100){

clearInterval(timer);

if(status){
status.innerText="STATUS: COMPLETE";
}

}

},300);

}


document.getElementById("generate-red")?.addEventListener("click",()=>generate("red"));

document.getElementById("generate-blue")?.addEventListener("click",()=>generate("blue"));



/* ===============================
INIT
=============================== */

updateUI();
  
