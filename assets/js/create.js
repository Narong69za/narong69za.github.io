/*
=====================================
ULTRA AUTO UI FINAL CLEAN
SN DESIGN STUDIO
STATIC MODEL FLOW
=====================================
*/

console.log("ULTRA CREATE UI START");

const API_BASE = "https://sn-design-api.onrender.com";

/*
=====================================
SAFE DOM GET
=====================================
*/

const container = document.getElementById("auto-template-container");

if(!container){

   console.error("AUTO UI ERROR: #auto-template-container NOT FOUND");
   throw new Error("UI container missing");

}

/*
=====================================
LOAD TEMPLATE LIST
=====================================
*/

async function loadTemplates(){

   try{

      console.log("FETCH:", API_BASE + "/api/templates");

      const res = await fetch(`${API_BASE}/api/templates`);

      if(!res.ok){
         throw new Error("API RESPONSE FAILED");
      }

      const presets = await res.json();

      console.log("TEMPLATES:", presets);

      buildUI(presets);

   }catch(err){

      console.error("LOAD TEMPLATE ERROR:",err);

      container.innerHTML = `
         <div class="preset-error">
            API LOAD FAILED
         </div>
      `;
   }

}

/*
=====================================
BUILD CARD UI
=====================================
*/

function buildUI(presets){

   container.innerHTML = "";

   Object.values(presets).forEach(preset => {

      const card = document.createElement("div");

      card.className = "auto-card";

      card.innerHTML = `

         <div class="engine">
            ENGINE : ${preset.id}
         </div>

         <div>Credit : ${preset.creditCost ?? "--"}</div>
         <div>Limit : ${preset.limits?.maxDuration ?? "--"}</div>

         <textarea class="prompt-input"
         placeholder="Enter prompt..."></textarea>

         <button class="cta-btn">
            CREATE
         </button>

         <div class="status">
            STATUS : IDLE
         </div>
      `;

      const btn = card.querySelector(".cta-btn");
      const input = card.querySelector(".prompt-input");
      const status = card.querySelector(".status");

      btn.addEventListener("click", async ()=>{

         status.innerText = "STATUS : SENDING";

         try{

            const res = await fetch(`${API_BASE}/api/render`,{

               method:"POST",

               headers:{
                  "Content-Type":"application/json"
               },

               body:JSON.stringify({

                  preset: preset.id,
                  prompt: input.value || ""

               })

            });

            const result = await res.json();

            console.log("RENDER RESULT:",result);

            if(result.success){

               status.innerText = "STATUS : SUCCESS";

            }else{

               status.innerText = "STATUS : FAILED";

            }

         }catch(e){

            console.error(e);

            status.innerText = "STATUS : ERROR";

         }

      });

      container.appendChild(card);

   });

}

/*
=====================================
START ENGINE
=====================================
*/

document.addEventListener("DOMContentLoaded",()=>{

   console.log("DOM READY → START LOAD");

   loadTemplates();

});
