// =================================================
// ULTRA ENGINE CONTROL FINAL
// FINAL LOCK VERSION
// DO NOT CHANGE UI
// =================================================

const API_URL = "https://sn-design-api.onrender.com/api/render";

let isRunning = false;


// ================= STATUS UI =================

function setStatus(text){

    const el = document.getElementById("statusText");

    if(el){
        el.innerText = "STATUS: " + text;
    }

}


// ================= PREVIEW =================

function updatePreview(fileA,fileB){

    const previewA = document.getElementById("previewA");
    const previewB = document.getElementById("previewB");

    if(fileA && previewA){
        previewA.src = URL.createObjectURL(fileA);
    }

    if(fileB && previewB){
        previewB.src = URL.createObjectURL(fileB);
    }

}


// ================= RUN AI =================

async function runAI(engine,btn){

    if(isRunning) return;

    const fileA = document.getElementById("fileSource")?.files?.[0];
    const fileB = document.getElementById("fileTarget")?.files?.[0];
    const prompt = document.getElementById("prompt")?.value || "";

    if(!fileA){

        alert("ต้องเลือก Source ก่อน");

        return;

    }

    updatePreview(fileA,fileB);

    const formData = new FormData();

    // IMPORTANT — MUST MATCH BACKEND
    formData.append("engine",engine);
    formData.append("alias",engine);
    formData.append("type","video");
    formData.append("prompt",prompt);

    formData.append("fileA",fileA);

    if(fileB){
        formData.append("fileB",fileB);
    }

    try{

        isRunning = true;

        setStatus("SENDING RUNWAY REQUEST...");

        const res = await fetch(API_URL,{
            method:"POST",
            body:formData
        });

        const data = await res.json();

        console.log("RUNWAY RESULT:",data);

        if(!res.ok){

            throw new Error(data.error || "Render failed");

        }

        setStatus("SUCCESS");

    }
    catch(err){

        console.error(err);

        setStatus("ERROR");

        alert(err.message);

    }
    finally{

        isRunning = false;

    }

}

window.runAI = runAI;
