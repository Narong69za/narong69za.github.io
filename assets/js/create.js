let STATE = {
  engine:null,
  mode:null,
  type:null
};

const fileA = document.getElementById("fileA");
const fileB = document.getElementById("fileB");

const previewRedVideo = document.getElementById("preview-red-video");
const previewRedImage = document.getElementById("preview-red-image");

const previewBlueVideo = document.getElementById("preview-blue-video");
const previewBlueImage = document.getElementById("preview-blue-image");

const statusEl = document.getElementById("status");

function preview(file, videoEl, imageEl){

  if(!file) return;

  const url = URL.createObjectURL(file);

  if(file.type.startsWith("video/")){
    videoEl.src = url;
    videoEl.style.display="block";
    imageEl.style.display="none";
  }

  if(file.type.startsWith("image/")){
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


// TYPE SELECT

document.querySelectorAll(".type-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    STATE.type = btn.dataset.type;
    document.querySelectorAll(".type-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
  });
});


// MODE SELECT

document.querySelectorAll(".mode-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{

    STATE.engine = btn.dataset.engine;
    STATE.mode = btn.dataset.mode;

    document.querySelectorAll(".mode-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");

  });
});


// GENERATE

async function generate(engine){

  if(!STATE.mode || !STATE.type){

    statusEl.innerText="STATUS: SELECT MODE & TYPE";
    return;

  }

  statusEl.innerText="STATUS: PROCESSING...";

  try{

    const res = await fetch("/api/render",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        engine:engine,
        mode:STATE.mode,
        type:STATE.type
      })
    });

    const data = await res.json();

    console.log(data);

    statusEl.innerText="STATUS: DONE";

  }catch(e){

    console.error(e);
    statusEl.innerText="STATUS: ERROR";

  }
}

document.getElementById("generate-red")?.addEventListener("click",()=>generate("red"));
document.getElementById("generate-blue")?.addEventListener("click",()=>generate("blue"));
