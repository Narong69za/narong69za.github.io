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

hint.innerText = REQUIRE[STATE.mode] || "";

}

/* TYPE SELECT */

typeBtns.forEach(btn=>{

btn.onclick = ()=>{

typeBtns.forEach(b=>b.classList.remove("active"));
btn.classList.add("active");

STATE.type = btn.dataset.type;
updatePreview();

};

});

/* MODE SELECT */

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
PREVIEW SYSTEM (ADD ONLY)
====================== */

function previewFile(file){

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

fileA.onchange = ()=> previewFile(fileA.files[0]);
fileB.onchange = ()=> previewFile(fileB.files[0]);

/* ======================
VALIDATION MATRIX
====================== */

function validateFiles(){

if(!STATE.mode) return false;

if(STATE.mode==="dark") return true;

if(STATE.mode==="face")
return fileA.files.length && fileB.files.length;

if(STATE.mode==="motion")
return fileA.files.length && fileB.files.length;

if(STATE.mode==="lipsync")
return fileA.files.length || fileB.files.length;

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
