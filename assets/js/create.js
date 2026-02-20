/*
=====================================
ULTRA AUTO UI FINAL
SN DESIGN STUDIO
AUTO TEMPLATE BUILDER
=====================================
*/

console.log("ULTRA AUTO UI START");

const API_BASE = "https://sn-design-api.onrender.com";

const container = document.getElementById("auto-template-container");

if(!container){

   console.error("AUTO UI ERROR: container not found");
}

/*
=====================================
FETCH PRESETS AUTO
=====================================
*/

async function loadTemplates(){

   try{

      console.log("LOADING PRESETS...");

      const res = await fetch(`${API_BASE}/api/templates`);

      if(!res.ok){
         throw new Error("API FAILED");
      }

      const presets = await res.json();

      console.log("PRESETS RECEIVED:",presets);

      buildUI(presets);

   }catch(err){

      console.error("LOAD TEMPLATE ERROR:",err);

      container.innerHTML = `
         <div class="preset-error">
            PRESET LOAD FAILED
         </div>
      `;
   }

}

/*
=====================================
AUTO CARD BUILDER
=====================================
*/

function buildUI(presets){

   container.innerHTML = "";

   Object.keys(presets).forEach(key => {

      const preset = presets[key];

      const card = document.createElement("div");

      card.className = "auto-card";

      card.innerHTML = `

         <div class="engine">
            ENGINE: ${preset.id || key}
         </div>

         <div>User: SN USER</div>
         <div>Credit: ${preset.credit || "--"}</div>
         <div>Limit: ${preset.limit || "--"}</div>

         <input class="prompt-input" placeholder="Enter prompt..." />

         <button class="cta-btn">
            CREATE VIDEO
         </button>

         <div class="status">
            STATUS: IDLE
         </div>

      `;

      const button = card.querySelector(".cta-btn");

      const input = card.querySelector(".prompt-input");

      const status = card.querySelector(".status");

      button.addEventListener("click", async ()=>{

         const prompt = input.value;

         status.innerText = "STATUS: SENDING...";

         try{

            const res = await fetch(`${API_BASE}/api/render`,{

               method:"POST",
               headers:{
                  "Content-Type":"application/json"
               },
               body:JSON.stringify({

                  preset: preset.id || key,
                  prompt: prompt

               })

            });

            const data = await res.json();

            console.log("RENDER RESPONSE:",data);

            if(data.success){

               status.innerText = "STATUS: SUCCESS";

            }else{

               status.innerText = "STATUS: FAILED";

            }

         }catch(e){

            console.error(e);

            status.innerText = "STATUS: ERROR";

         }

      });

      container.appendChild(card);

   });

}

/*
=====================================
START
=====================================
*/

document.addEventListener("DOMContentLoaded",()=>{

   console.log("DOM READY → LOAD AUTO UI");

   loadTemplates();

});
