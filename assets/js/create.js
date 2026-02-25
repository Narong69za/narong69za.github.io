const API_BASE = "https://sn-design-api.onrender.com";

const btnGenerate = document.getElementById("generate-red");
const statusText = document.getElementById("status");

btnGenerate.addEventListener("click", async ()=>{

    statusText.innerText = "STATUS: SENDING RUNWAY REQUEST...";

    const formData = new FormData();

    const motion = document.getElementById("file-motion").files[0];
    const character = document.getElementById("file-character").files[0];
    const prompt = document.getElementById("prompt").value;

    if(motion) formData.append("motion", motion);
    if(character) formData.append("character", character);

    formData.append("prompt", prompt);

    try{

        const res = await fetch(API_BASE + "/api/runway/v1/image_to_video",{
            method:"POST",
            body:formData
        });

        const data = await res.json();

        if(data.output){

            document.getElementById("preview-video").src = data.output;

            statusText.innerText = "STATUS: SUCCESS";

        }else{

            statusText.innerText = "STATUS: ERROR";

        }

    }catch(err){

        console.error(err);
        statusText.innerText = "STATUS: FAIL";

    }

});
// ===============================
// ACTIVE MODEL SELECT (GREEN GLOW)
// ===============================

let selectedModel = null;

document.querySelectorAll(".model-btn").forEach(btn=>{

    btn.addEventListener("click",()=>{

        document.querySelectorAll(".model-btn").forEach(b=>{
            b.classList.remove("active-model");
        });

        btn.classList.add("active-model");

        selectedModel = btn.dataset.model;

    });

});
