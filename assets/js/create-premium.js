/*
=====================================
ULTRA CREATE PREMIUM FINAL
SN DESIGN STUDIO
ULTRA CONTROL PANEL NEXT
ADD ONLY VERSION
=====================================
*/

const API="https://sn-design-api.onrender.com";

let CURRENT_ENGINE=null;
let CURRENT_MODE=null;
let CURRENT_TYPE=null;
let CURRENT_FILE=null;

init();

/*
=====================================
INIT
=====================================
*/

function init(){

   bindEngineButtons();
   bindTypeButtons();
   bindFileInput();

}

/*
=====================================
ENGINE SELECT
=====================================
*/

function bindEngineButtons(){

   document.querySelectorAll(".red-engine .mode").forEach(el=>{
      el.onclick=()=>selectEngine("replicate",el.dataset.mode);
   });

   document.querySelectorAll(".blue-engine .mode").forEach(el=>{
      el.onclick=()=>selectEngine("runway",el.dataset.mode);
   });

}

function selectEngine(engine,mode){

   CURRENT_ENGINE=engine;
   CURRENT_MODE=mode;

   updatePreviewLabel();

}

/*
=====================================
TYPE SELECT (video / image / upscale)
=====================================
*/

function bindTypeButtons(){

   document.querySelectorAll(".type-select").forEach(btn=>{

      btn.onclick=()=>{

         CURRENT_TYPE=btn.dataset.type;

         document.querySelectorAll(".type-select")
         .forEach(b=>b.classList.remove("active"));

         btn.classList.add("active");

         updatePreviewLabel();

      };

   });

}

/*
=====================================
FILE IMPORT + LIVE PREVIEW
=====================================
*/

function bindFileInput(){

   const input=document.querySelector("#fileInput");

   if(!input) return;

   input.onchange=()=>{

      const file=input.files[0];

      if(!file) return;

      CURRENT_FILE=file;

      renderPreview(file);

   };

}

function renderPreview(file){

   let previewBox=document.getElementById("previewMedia");

   if(!previewBox){

      previewBox=document.createElement("div");
      previewBox.id="previewMedia";

      const container=document.querySelector(".project-preview");

      if(container) container.appendChild(previewBox);

   }

   previewBox.innerHTML="";

   const url=URL.createObjectURL(file);

   if(file.type.startsWith("video")){

      const vid=document.createElement("video");
      vid.src=url;
      vid.controls=true;
      vid.autoplay=true;
      vid.loop=true;
      vid.style.width="100%";

      previewBox.appendChild(vid);

   }else if(file.type.startsWith("image")){

      const img=document.createElement("img");
      img.src=url;
      img.style.width="100%";

      previewBox.appendChild(img);

   }

}

/*
=====================================
PREVIEW LABEL UPDATE
=====================================
*/

function updatePreviewLabel(){

   const label=document.getElementById("previewInfo");

   if(!label) return;

   label.innerText=
   `ENGINE: ${CURRENT_ENGINE || "-"} | MODE: ${CURRENT_MODE || "-"} | TYPE: ${CURRENT_TYPE || "-"}`;

}

/*
=====================================
GENERATE BUTTON
=====================================
*/

document.addEventListener("click",(e)=>{

   if(e.target.id!=="generateBtn") return;

   generate();

});

async function generate(){

   if(!CURRENT_ENGINE || !CURRENT_MODE){

      setStatus("SELECT ENGINE FIRST");
      return;

   }

   setStatus("PROCESSING");

   try{

      const res=await fetch(API+"/api/render",{

         method:"POST",

         headers:{
            "Content-Type":"application/json"
         },

         body:JSON.stringify({

            engine:CURRENT_ENGINE,
            mode:CURRENT_MODE,
            type:CURRENT_TYPE,
            prompt:document.getElementById("promptBox")?.value || ""

         })

      });

      const data=await res.json();

      console.log("RESULT:",data);

      if(data.success){

         setStatus("COMPLETE");

      }else{

         setStatus("FAILED");

      }

   }catch(err){

      console.error(err);
      setStatus("ERROR");

   }

}

/*
=====================================
STATUS
=====================================
*/

function setStatus(text){

   const el=document.getElementById("statusText");

   if(el){

      el.innerText="STATUS: "+text;

   }

}
