/*
====================================
ULTRA AUTO PAGE BUILDER
SN DESIGN STUDIO FINAL
====================================
*/

const API_BASE = "https://sn-design-api.onrender.com/api";

const templateContainer = document.getElementById("auto-template-container");
const engineBlock = document.getElementById("engineBlock");
const autoInputs = document.getElementById("autoInputs");
const statusEl = document.getElementById("status");

let CURRENT_PRESET = null;

/*
====================================
LOAD TEMPLATE LIST
====================================
*/

async function loadTemplates(){

   const res = await fetch(`${API_BASE}/templates`);
   const list = await res.json();

   templateContainer.innerHTML = "";

   list.forEach(t=>{

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
         <strong>${t.name || t.id}</strong><br>
         Provider: ${t.provider}
      `;

      card.onclick = ()=> loadPreset(t.id);

      templateContainer.appendChild(card);

   });

}

/*
====================================
LOAD PRESET DETAIL
====================================
*/

async function loadPreset(id){

   statusEl.innerText = "STATUS: LOADING";

   const res = await fetch(`${API_BASE}/templates/${id}`);
   const data = await res.json();

   CURRENT_PRESET = data;

   engineBlock.innerHTML = `
      ENGINE: ${data.id}<br>
      Credit: ${data.creditCost || "--"}<br>
      Limit: ${data.limits?.maxDuration || "--"}s
   `;

   buildInputs(data);

   statusEl.innerText = "STATUS: READY";

}

/*
====================================
AUTO BUILD INPUT
====================================
*/

function buildInputs(preset){

   autoInputs.innerHTML = "";

   if(!preset.input) return;

   if(preset.input.prompt){

      autoInputs.innerHTML += `
         <textarea id="prompt" placeholder="Enter prompt"></textarea>
      `;
   }

   if(preset.input.image){

      autoInputs.innerHTML += `
         <input type="file" id="imageInput"/>
      `;
   }

   if(preset.input.video){

      autoInputs.innerHTML += `
         <input type="file" id="videoInput"/>
      `;
   }

}

/*
====================================
CREATE JOB
====================================
*/

document.getElementById("cta").addEventListener("click", async ()=>{

   if(!CURRENT_PRESET){

      statusEl.innerText = "STATUS: PRESET ERROR";
      return;

   }

   statusEl.innerText = "STATUS: PROCESSING";

   const payload = {

      preset: CURRENT_PRESET.id,
      prompt: document.getElementById("prompt")?.value || null

   };

   const res = await fetch(`${API_BASE}/render`,{

      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify(payload)

   });

   const result = await res.json();

   if(result.success){

      statusEl.innerText = "STATUS: SUCCESS";

   }else{

      statusEl.innerText = "STATUS: ERROR";

   }

});

/*
====================================
INIT
====================================
*/

loadTemplates();
