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

   setEngine("UNKNOWN");

 }

}


function buildUI(p){

 setEngine(p.name||"UNKNOWN");

 renderModels(p.models||[]);

 toggle("uploadVideo",p.ui?.needVideo);
 toggle("uploadImage",p.ui?.needImage);
 toggle("promptBox",p.ui?.needPrompt);

}


function setEngine(name){

 document.getElementById("engineName").innerText="ENGINE: "+name;

}


function renderModels(models){

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

 document.getElementById("statusText").innerText="STATUS: PROCESSING";

 simulateProgress();

 try{

   const res=await fetch(API+"/api",{

     method:"POST",
     headers:{"Content-Type":"application/json"},
     body:JSON.stringify({
       preset:CURRENT_PRESET.id
     })

   });

   await res.json();

   document.getElementById("statusText").innerText="STATUS: COMPLETE";
   setProgress(100);

 }catch(e){

   document.getElementById("statusText").innerText="STATUS: ERROR";

 }

};


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

 document.getElementById("progressBar").style.width=val+"%";

 }
