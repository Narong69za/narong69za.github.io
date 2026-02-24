let STATE = {
engine:null,
mode:null,
type:null
};

const typeBtns = document.querySelectorAll("[data-type]");
const modeBtns = document.querySelectorAll("[data-mode]");
const info = document.getElementById("model-info");
const fileA = document.getElementById("fileA");
const fileB = document.getElementById("fileB");

function updatePreview(){
info.innerText =
`ENGINE: ${STATE.engine || "-"} | MODE: ${STATE.mode || "-"} | TYPE: ${STATE.type || "-"}`;
}

typeBtns.forEach(btn=>{
btn.onclick = ()=>{
typeBtns.forEach(b=>b.classList.remove("active"));
btn.classList.add("active");
STATE.type = btn.dataset.type;
updatePreview();
};
});

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

function validateFiles(){

if(!STATE.mode) return false;

if(STATE.mode==="face") return fileA.files.length && fileB.files.length;

if(STATE.mode==="lipsync" || STATE.mode==="motion")
return fileA.files.length && fileB.files.length;

if(STATE.type==="upscale")
return fileA.files.length;

return true;
}

async function generate(){

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

await fetch("/api/render",{ method:"POST", body:form });

document.getElementById("status").innerText="STATUS: COMPLETE";
}

document.getElementById("generate-red").onclick=generate;
document.getElementById("generate-blue").onclick=generate;
