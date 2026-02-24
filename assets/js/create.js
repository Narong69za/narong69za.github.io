/* ===============================
   SN DESIGN ENGINE AI — FINAL JS
   RUNWAY + REPLICATE COMPAT
================================ */

let STATE = {
  engine: null,
  model: null,
  mode: null,
  type: null
};

/* ===============================
   DOM
================================ */

const $ = (q)=>document.querySelector(q);
const $$ = (q)=>document.querySelectorAll(q);

const fileA = $("#fileA");
const fileB = $("#fileB");

const previewRedVideo = $("#preview-red-video");
const previewRedImage = $("#preview-red-image");

const previewBlueVideo = $("#preview-blue-video");
const previewBlueImage = $("#preview-blue-image");

const promptInput = $("#prompt");

/* ===============================
   ENGINE SELECT
================================ */

$$("[data-engine]").forEach(btn=>{
  btn.onclick=()=>{

    STATE.engine = btn.dataset.engine;

    $$("[data-engine]").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");

    glowEngine();
  };
});

/* ===============================
   MODEL SELECT
================================ */

$$("[data-model]").forEach(btn=>{
  btn.onclick=()=>{

    STATE.model = btn.dataset.model;

    $$("[data-model]").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");

    glowEngine();
  };
});

/* ===============================
   MODE SELECT
================================ */

$$("[data-mode]").forEach(btn=>{
  btn.onclick=()=>{

    STATE.mode = btn.dataset.mode;

    $$("[data-mode]").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
  };
});

/* ===============================
   ENGINE GLOW
================================ */

function glowEngine(){

  const red = $(".red-engine");
  const blue = $(".blue-engine");

  red?.classList.remove("glow");
  blue?.classList.remove("glow");

  if(STATE.engine==="red") red?.classList.add("glow");
  if(STATE.engine==="blue") blue?.classList.add("glow");
}

/* ===============================
   PREVIEW
================================ */

function preview(file, videoEl, imageEl){

  if(!file) return;

  const url = URL.createObjectURL(file);

  if(file.type.startsWith("video/")){
    videoEl.src = url;
    videoEl.style.display="block";
    imageEl.style.display="none";
  }

  else if(file.type.startsWith("image/")){
    imageEl.src = url;
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
   GENERATE
================================ */

async function generate(){

  if(!STATE.engine || !STATE.model){
    alert("Select Engine + Model");
    return;
  }

  const payload = {
    engine: STATE.engine,
    model: STATE.model,
    mode: STATE.mode,
    prompt: promptInput?.value || ""
  };

  try{

    const res = await fetch("/api/create",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body:JSON.stringify(payload)
    });

    const data = await res.json();

    console.log("RESULT",data);

  }catch(e){
    console.error(e);
  }
}

$$("[data-generate]").forEach(btn=>{
  btn.onclick=generate;
});
