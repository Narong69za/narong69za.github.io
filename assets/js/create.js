let STATE={
engine:"replicate",
mode:"generate",
type:"video"
};

const fileA=document.getElementById("fileA");
const fileB=document.getElementById("fileB");

const previewRedVideo=document.getElementById("preview-red-video");
const previewRedImage=document.getElementById("preview-red-image");

const previewBlueVideo=document.getElementById("preview-blue-video");
const previewBlueImage=document.getElementById("preview-blue-image");

function preview(file,videoEl,imageEl){

if(!file) return;

const url=URL.createObjectURL(file);

if(file.type.startsWith("video/")){
videoEl.src=url;
videoEl.style.display="block";
imageEl.style.display="none";
}

if(file.type.startsWith("image/")){
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
/* ===============================
ENGINE ACTIVE SELECT SYSTEM
================================ */

const allEngineBtns=document.querySelectorAll("[data-engine]");

allEngineBtns.forEach(btn=>{

btn.addEventListener("click",()=>{

// remove active from siblings inside same engine
const parentEngine=btn.closest(".engine");

parentEngine
.querySelectorAll("[data-engine]")
.forEach(b=>b.classList.remove("active-select"));

// add active
btn.classList.add("active-select");

// update STATE
STATE.engine=btn.dataset.engine==="red"
?"replicate"
:"runway";

STATE.mode=btn.dataset.mode;

});

});
