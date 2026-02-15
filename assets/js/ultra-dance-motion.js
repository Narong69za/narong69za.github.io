/* ======================================
ULTRA LIVE MOTION UI
CINEMATIC AI SCAN LEVEL MAX
SN DESIGN STUDIO
====================================== */


/* ==========================
ULTRA AI CONFIG (EDIT ONLY API KEY)
========================== */

const ULTRA_AI_CONFIG = {

API_KEY: "AIzaSyD3TJY4cypM9nHUA7NShCFXBtaUHUZqHHQ",

PROJECT_STORAGE: "https://storage.googleapis.com"

};



document.addEventListener("DOMContentLoaded", function(){

const videoInput = document.getElementById("videoInput");
const imageInput = document.getElementById("imageInput");

const videoPreview = document.getElementById("videoPreview");
const imagePreview = document.getElementById("imagePreview");

let scanLayer;
let radarLayer;
let progressBar;
let statusList;


/* =========================
CREATE CINEMATIC LAYERS
========================= */

function buildCinematicLayer(target){

    target.style.position="relative";
    target.style.overflow="hidden";

    scanLayer = document.createElement("div");
    scanLayer.style.position="absolute";
    scanLayer.style.width="100%";
    scanLayer.style.height="3px";
    scanLayer.style.background="linear-gradient(90deg,#00ffff,#ff0044)";
    scanLayer.style.boxShadow="0 0 18px #00ffff";
    scanLayer.style.top="0";
    scanLayer.style.animation="scanBeam 2s linear infinite";

    radarLayer = document.createElement("div");
    radarLayer.style.position="absolute";
    radarLayer.style.width="200%";
    radarLayer.style.height="200%";
    radarLayer.style.top="-50%";
    radarLayer.style.left="-50%";
    radarLayer.style.pointerEvents="none";
    radarLayer.style.background="radial-gradient(circle, rgba(0,255,255,0.12) 0%, transparent 60%)";
    radarLayer.style.animation="radarPulse 3s ease-in-out infinite";

    target.appendChild(scanLayer);
    target.appendChild(radarLayer);

}


/* =========================
ADD STYLE ONCE
========================= */

if(!document.getElementById("ultra-cinematic-style")){

const style = document.createElement("style");
style.id="ultra-cinematic-style";

style.innerHTML = `

@keyframes scanBeam{
0%{top:0}
100%{top:100%}
}

@keyframes radarPulse{
0%{transform:scale(0.6);opacity:0.2}
50%{transform:scale(1);opacity:0.6}
100%{transform:scale(1.4);opacity:0}
}

`;

document.head.appendChild(style);

}


/* =========================
VIDEO PREVIEW
========================= */

videoInput.addEventListener("change", function(){

const file = this.files[0];
if(!file) return;

videoPreview.innerHTML="";

const video=document.createElement("video");
video.src=URL.createObjectURL(file);
video.controls=true;

videoPreview.appendChild(video);

buildCinematicLayer(videoPreview);
startAI();

});


/* =========================
IMAGE PREVIEW
========================= */

imageInput.addEventListener("change", function(){

const file=this.files[0];
if(!file) return;

imagePreview.innerHTML="";

const img=document.createElement("img");
img.src=URL.createObjectURL(file);

imagePreview.appendChild(img);

buildCinematicLayer(imagePreview);
startAI();

});


/* =========================
ULTRA AI PROCESS
========================= */

function startAI(){

if(!progressBar){

progressBar=document.createElement("div");
progressBar.style.marginTop="20px";
progressBar.style.fontSize="14px";
progressBar.innerText="AI LIVE SCAN — 0%";

document.querySelector(".container").appendChild(progressBar);

}

statusList=document.querySelector("ul");

let progress=0;

const steps=[
"motion reference detected",
"pose tracking active",
"skeleton mapping",
"neural motion transfer",
"rendering output"
];

let index=0;

const loop=setInterval(()=>{

progress+=2;
progressBar.innerText="AI LIVE SCAN — "+progress+"%";

if(progress%20===0 && index<steps.length){

const li=document.createElement("li");
li.innerText="✔ "+steps[index];
statusList.appendChild(li);
index++;

}

if(progress>=100){

clearInterval(loop);
progressBar.innerText="AI LIVE SCAN — COMPLETE";

if(scanLayer) scanLayer.style.animation="none";
if(radarLayer) radarLayer.style.animation="none";

}

},80);

}

});
