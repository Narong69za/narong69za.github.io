const API="https://api.sn-designstudio.dev";

let CURRENT_PRESET=null;

init();

async function init(){

 await loadPreset();

}


async function loadPreset(){

 const params=new URLSearchParams(location.search);

 const id=params.get("template");

 if(!id){

   setEngineName("unknown");
   return;

 }

 try{

   const res=await fetch(API+"/api/templates/"+id);

   if(!res.ok) throw "preset not found";

   const preset=await res.json();

   CURRENT_PRESET=preset;

   buildUI(preset);

 }catch(e){

   setEngineName("unknown");

 }

}


function buildUI(p){

 setEngineName(p.name || "unknown");

 renderModelDropdown(p.models || []);

 toggle("uploadVideo",p.ui?.needVideo);
 toggle("uploadImage",p.ui?.needImage);
 toggle("promptBox",p.ui?.needPrompt);

}


function setEngineName(name){

 document.getElementById("engineName").innerText="ENGINE: "+name;

}


function renderModelDropdown(models){

 const select=document.getElementById("modelSelect");

 select.innerHTML="";

 models.forEach(m=>{

   const opt=document.createElement("option");

   opt.value=m.name;
   opt.innerText=m.name;

   select.appendChild(opt);

 });

}


function toggle(id,state){

 const el=document.getElementById(id);

 if(state) el.classList.remove("hidden");
 else el.classList.add("hidden");

}


document.getElementById("generateBtn").onclick=async()=>{

 if(!CURRENT_PRESET) return;

 document.getElementById("statusBar").innerText="STATUS: PROCESSING";

 try{

   const res=await fetch(API+"/api",{

      method:"POST",
      headers:{"Content-Type":"application/json"},

      body:JSON.stringify({
         preset:CURRENT_PRESET.id
      })

   });

   await res.json();

   document.getElementById("statusBar").innerText="STATUS: COMPLETE";

 }catch(e){

   document.getElementById("statusBar").innerText="STATUS: ERROR";

 }

};
