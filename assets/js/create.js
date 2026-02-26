/* =====================================================
SN DESIGN ENGINE AI
CREATE.JS — ULTRA FINAL RENDER VERSION
LOCK UI LAYOUT
===================================================== */


/* ===============================
CONFIG
=============================== */

const API_URL = "https://sn-design-api.onrender.com/api/render";


/* ===============================
LOGIN STATE (สำคัญมาก)
=============================== */

function getUserId(){

   // DEV BYPASS (Owner Test Mode)
   const DEV_MODE = true;

   if(DEV_MODE){
      return "DEV-BYPASS";
   }

   return localStorage.getItem("userId");

}


/* ===============================
STATE
=============================== */

let STATE = {
   engine: "runwayml",
   alias: null
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

const statusEl = document.getElementById("status");


/* ===============================
FILE PREVIEW
=============================== */

function preview(file, videoEl, imageEl){

   if(!file) return;

   const url = URL.createObjectURL(file);

   videoEl.style.display="none";
   imageEl.style.display="none";

   if(file.type.startsWith("video/")){
      videoEl.src = url;
      videoEl.style.display="block";
   }

   if(file.type.startsWith("image/")){
      imageEl.src = url;
      imageEl.style.display="block";
   }
}

fileA?.addEventListener("change",()=>{
   preview(fileA.files[0],previewRedVideo,previewRedImage);
});

fileB?.addEventListener("change",()=>{
   preview(fileB.files[0],previewBlueVideo,previewBlueImage);
});


/* ===============================
GREEN GLOW ACTIVE
=============================== */

function initGlowButtons(){

   const buttons = document.querySelectorAll(
      ".model-btn, .cta-btn, .engine-btn"
   );

   buttons.forEach(btn=>{

      btn.addEventListener("click",function(){

         const group = this.closest(".engine-box") || document;

         group.querySelectorAll(".active")
         .forEach(el=>el.classList.remove("active"));

         this.classList.add("active");

      });

   });

}

initGlowButtons();


/* ===============================
MODEL SELECT
=============================== */

document.querySelectorAll(".model-btn").forEach(btn=>{

   btn.addEventListener("click",()=>{

      STATE.alias = btn.dataset.alias;

      console.log("MODEL SELECT:",STATE);

   });

});


/* ===============================
RUNWAY GENERATE
=============================== */

async function runGenerate(){

   const userId = getUserId();

   if(!userId){
      alert("ยังไม่ได้ Login");
      return;
   }

   if(!STATE.alias){
      alert("เลือก Model ก่อน");
      return;
   }

   if(!fileA?.files[0] && STATE.alias !== "text_to_video"){
      alert("ต้อง import fileA");
      return;
   }

   try{

      statusEl.innerText="STATUS: PROCESSING";

      const formData = new FormData();

      formData.append("engine","runwayml");
      formData.append("alias",STATE.alias);
      formData.append("type","video");
      formData.append("prompt",
         document.querySelector("textarea")?.value || "SN TEST"
      );

      if(fileA?.files[0]){
         formData.append("fileA",fileA.files[0]);
      }

      if(fileB?.files[0]){
         formData.append("fileB",fileB.files[0]);
      }

      const res = await fetch(API_URL,{
         method:"POST",
         headers:{
            "Authorization": userId
         },
         body:formData
      });

      const data = await res.json();

      console.log("RUNWAY RESPONSE:",data);

      if(!res.ok){
         throw new Error(data.error || "Render Failed");
      }

      statusEl.innerText="STATUS: SUCCESS";

   }catch(err){

      console.error(err);

      statusEl.innerText="STATUS: ERROR";

      alert(err.message);

   }

}


/* ===============================
ENGINE BUTTON
=============================== */

document.querySelectorAll(".engine-btn")[0]
?.addEventListener("click",runGenerate);
