/*
=====================================
ULTRA CREATE PREMIUM FINAL
SN DESIGN STUDIO
STATIC LOCK FLOW
ADD ONLY VERSION
=====================================
*/

const API="https://sn-design-api.onrender.com";

let CURRENT_PRESET=null;

init();

async function init(){

   await loadPreset();

}

/*
=====================================
LOAD TEMPLATE FROM URL
=====================================
*/

async function loadPreset(){

   const params=new URLSearchParams(location.search);

   const id=params.get("template");

   if(!id){

      setEngine("UNKNOWN");

      return;

   }

   try{

      const res=await fetch(API+"/api/templates/"+id);

      if(!res.ok) throw "preset error";

      const preset=await res.json();

      CURRENT_PRESET=preset;

      buildUI(preset);

   }catch(e){

      console.error(e);

      setEngine("UNKNOWN");

   }

}

/*
=====================================
BUILD UI
=====================================
*/

function buildUI(p){

   setEngine(p.id || "UNKNOWN");

   toggle("uploadVideo",p.ui?.needVideo);
   toggle("uploadImage",p.ui?.needImage);
   toggle("promptBox",p.ui?.needPrompt);

}

/*
=====================================
SET ENGINE LABEL
=====================================
*/

function setEngine(name){

   const el=document.getElementById("engineName");

   if(el){

      el.innerText="ENGINE: "+name;

   }

}

/*
=====================================
SHOW / HIDE UI BLOCK
=====================================
*/

function toggle(id,state){

   const el=document.getElementById(id);

   if(!el) return;

   if(state) el.classList.remove("hidden");
   else el.classList.add("hidden");

}

/*
=====================================
CTA GENERATE
=====================================
*/

const btn=document.getElementById("generateBtn");

if(btn){

   btn.onclick=async()=>{

      if(!CURRENT_PRESET) return;

      setStatus("PROCESSING");

      simulateProgress();

      try{

         const res=await fetch(API+"/api/render",{

            method:"POST",

            headers:{
               "Content-Type":"application/json"
            },

            body:JSON.stringify({

               preset:CURRENT_PRESET.id,

               prompt:document.getElementById("promptBox")?.value || ""

            })

         });

         const data=await res.json();

         console.log("RENDER RESULT:",data);

         if(data.success){

            setStatus("COMPLETE");

            setProgress(100);

         }else{

            setStatus("FAILED");

         }

      }catch(e){

         console.error(e);

         setStatus("ERROR");

      }

   };

}

/*
=====================================
STATUS + PROGRESS
=====================================
*/

function setStatus(text){

   const el=document.getElementById("statusText");

   if(el){

      el.innerText="STATUS: "+text;

   }

}

function simulateProgress(){

   let progress=0;

   const interval=setInterval(()=>{

      progress+=10;

      if(progress>=90){

         clearInterval(interval);

      }

      setProgress(progress);

   },300);

}

function setProgress(val){

   const bar=document.getElementById("progressBar");

   if(bar){

      bar.style.width=val+"%";

   }

}

/*
=====================================
ULTRA CINEMATIC PREVIEW SYSTEM
ADD ONLY
=====================================
*/

const fileInput=document.querySelector('input[type="file"]');
const previewBox=document.getElementById("previewBox");

if(fileInput && previewBox){

fileInput.addEventListener("change",(e)=>{

const file=e.target.files[0];
if(!file) return;

const url=URL.createObjectURL(file);

previewBox.innerHTML="";

if(file.type.startsWith("video")){

const video=document.createElement("video");

video.src=url;
video.controls=true;
video.autoplay=true;
video.loop=true;
video.muted=true;

video.style.width="100%";
video.style.borderRadius="12px";

previewBox.appendChild(video);

}else if(file.type.startsWith("image")){

const img=document.createElement("img");

img.src=url;
img.style.width="100%";
img.style.borderRadius="12px";

previewBox.appendChild(img);

}

});

}

/*
=====================================
ULTRA ENGINE MODE VISUAL SELECT
(RED / BLUE highlight)
ADD ONLY
=====================================
*/

document.querySelectorAll(".engine-mode").forEach(btn=>{

btn.addEventListener("click",()=>{

const parent=btn.closest(".engine-block");

if(!parent) return;

parent.querySelectorAll(".engine-mode").forEach(b=>{

b.classList.remove("active");

});

btn.classList.add("active");

});

});
