/* =============================
ENGINE MODEL DATABASE
============================= */

const ENGINE_MODELS={

replicate:{

flux2pro:{
type:"image",
modes:["generate","variation","style","upscale"]
},

faceclone:{
type:"image",
modes:["faceswap"]
}

},

runway:{

gen4video:{
type:"video",
modes:["motion","image2video","lipsync","dance","generate"]
}

}

};


/* ============================= */

let STATE={

engine:null,
model:null,
mode:null,
type:null

};


/* ============================= */

const redTabs=document.getElementById("red-model-tabs");
const blueTabs=document.getElementById("blue-model-tabs");

const redModes=document.getElementById("red-modes");
const blueModes=document.getElementById("blue-modes");


/* ============================= */

function buildModelTabs(){

Object.keys(ENGINE_MODELS.replicate).forEach(model=>{

const btn=document.createElement("button");

btn.innerText=model;

btn.onclick=()=>selectModel("replicate",model);

redTabs.appendChild(btn);

});

Object.keys(ENGINE_MODELS.runway).forEach(model=>{

const btn=document.createElement("button");

btn.innerText=model;

btn.onclick=()=>selectModel("runway",model);

blueTabs.appendChild(btn);

});

}

buildModelTabs();


/* ============================= */

function selectModel(engine,model){

STATE.engine=engine;
STATE.model=model;

setEngineActive(engine);

renderModes(engine,model);

updateUI();

}


/* ============================= */

function renderModes(engine,model){

const modes=ENGINE_MODELS[engine][model].modes;

const container=engine==="replicate"?redModes:blueModes;

container.innerHTML="";

modes.forEach(m=>{

const btn=document.createElement("button");

btn.innerText=m.toUpperCase();

btn.onclick=()=>{

STATE.mode=m;

document.querySelectorAll(".mode-container button")
.forEach(b=>b.classList.remove("active-mode"));

btn.classList.add("active-mode");

updateUI();

};

container.appendChild(btn);

});

}


/* ============================= */

function setEngineActive(engine){

document.querySelectorAll(".engine")
.forEach(e=>e.classList.remove("engine-active"));

if(engine==="replicate")
document.querySelector(".engine.red").classList.add("engine-active");

if(engine==="runway")
document.querySelector(".engine.blue").classList.add("engine-active");

}


/* ============================= */

const info=document.getElementById("model-info");

function updateUI(){

info.innerText=
`ENGINE: ${STATE.engine||"-"} | MODEL: ${STATE.model||"-"} | MODE: ${STATE.mode||"-"} | TYPE: ${STATE.type||"-"}`;

}


/* ============================= */

document.querySelectorAll("[data-type]").forEach(btn=>{

btn.onclick=()=>{

document.querySelectorAll("[data-type]")
.forEach(b=>b.classList.remove("active"));

btn.classList.add("active");

STATE.type=btn.dataset.type;

updateUI();

};

});


/* ============================= */

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

fileA.onchange=()=>preview(fileA.files[0],previewRedVideo,previewRedImage);
fileB.onchange=()=>preview(fileB.files[0],previewBlueVideo,previewBlueImage);


/* ============================= */

const progressFill=document.getElementById("progress-fill");

async function generate(){

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

document.getElementById("generate-red").onclick=generate;
document.getElementById("generate-blue").onclick=generate;

/* =================================
AUTO DEFAULT MODEL SELECT
================================= */

window.addEventListener("DOMContentLoaded",()=>{

if(!STATE.engine){

// auto select red default
const redDefault=document.querySelector('[data-engine="red"]');
redDefault?.click();

}

// ไม่ให้ blue collapse
document.querySelector(".engine.blue")
?.classList.add("engine-active");

});
