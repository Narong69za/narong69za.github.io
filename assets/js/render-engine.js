// =====================================
// SN DESIGN STUDIO
// ULTRA REAL OUTPUT PIPELINE
// FINAL FULL VERSION
// =====================================

document.addEventListener("DOMContentLoaded",()=>{

   const btn = document.getElementById("createBtn");

   if(!btn){
      console.log("CREATE BTN NOT FOUND");
      return;
   }

   btn.addEventListener("click", async ()=>{

      try{

         // ======================
         // LOGIN CHECK
         // ======================

         const user = localStorage.getItem("sn_user");

         if(!user){

            alert("LOGIN REQUIRED");
            return;

         }

         // ======================
         // GET TEMPLATE
         // ======================

         const params = new URLSearchParams(window.location.search);
         const template = params.get("template");

         // ======================
         // START RENDER
         // ======================

         btn.disabled = true;
         btn.innerText = "STARTING...";

         const start = await fetch("https://api.sn-designstudio.dev/api/render",{

            method:"POST",

            headers:{
               "Content-Type":"application/json"
            },

            body:JSON.stringify({
               template:template,
               input:{}
            })

         });

         const startData = await start.json();

         console.log("START DATA:",startData);

         if(!startData.success){

            alert("Render Failed");
            btn.disabled=false;
            btn.innerText="CREATE VIDEO";
            return;

         }

         alert("Render Job Sent");

         const jobId = startData.job_id;

         // ======================
         // POLLING ENGINE
         // ======================

         btn.innerText = "PROCESSING...";

         const poll = async ()=>{

            try{

               const res = await fetch(
                  "https://api.sn-designstudio.dev/api/render-status?job="+jobId
               );

               const data = await res.json();

               console.log("STATUS:",data);

               // processing
               if(data.status === "processing"){

                  setTimeout(poll,3000);
                  return;

               }

               // done
               if(data.status === "done"){

                  btn.innerText="DONE";

                  if(data.output){

                     const outputArea = document.createElement("div");
                     outputArea.style.marginTop="20px";

                     if(Array.isArray(data.output)){

                        data.output.forEach(url=>{

                           const img = document.createElement("img");
                           img.src = url;
                           img.style.width="100%";
                           img.style.marginBottom="10px";

                           outputArea.appendChild(img);

                        });

                     }else{

                        const img = document.createElement("img");
                        img.src = data.output;
                        img.style.width="100%";

                        outputArea.appendChild(img);

                     }

                     btn.parentElement.appendChild(outputArea);

                  }

                  btn.disabled=false;
                  btn.innerText="CREATE VIDEO";

                  return;

               }

               // error
               if(data.status === "error"){

                  alert("Render Failed");

                  btn.disabled=false;
                  btn.innerText="CREATE VIDEO";

                  return;

               }

            }catch(e){

               console.error(e);

               alert("Render Failed");

               btn.disabled=false;
               btn.innerText="CREATE VIDEO";

            }

         };

         poll();

      }catch(e){

         console.error(e);

         alert("Render Failed");

         btn.disabled=false;
         btn.innerText="CREATE VIDEO";

      }

   });

});
