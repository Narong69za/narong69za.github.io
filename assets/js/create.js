// ===============================
// ULTRA ENGINE CONTROL FINAL
// LOCKED STRUCTURE
// ===============================

const API_URL = "https://sn-design-api.onrender.com/api/render";

let isRunning = false;


// ===============================
// UI STATE
// ===============================

function setStatus(text){

    const el = document.querySelector("#statusText");

    if(el) el.innerText = text;

}

function glowActive(button){

    document.querySelectorAll(".engine-btn").forEach(b=>{
        b.style.boxShadow="none";
    });

    if(button){
        button.style.boxShadow="0 0 20px #00ffea";
    }

}


// ===============================
// RUN ENGINE
// ===============================

async function runAI(engine,btn){

    if(isRunning) return;

    const fileA = document.getElementById("fileSource")?.files?.[0];
    const fileB = document.getElementById("fileTarget")?.files?.[0];
    const prompt = document.getElementById("prompt")?.value || "";

    if(!fileA){

        alert("ต้องเลือก Source file");

        return;

    }

    const formData = new FormData();

    formData.append("engine", engine);
    formData.append("alias", engine);
    formData.append("type","video");
    formData.append("prompt",prompt);

    formData.append("fileA",fileA);

    if(fileB){

        formData.append("fileB",fileB);

    }

    try{

        isRunning = true;

        glowActive(btn);

        setStatus("STATUS: PROCESSING");

        const res = await fetch(API_URL,{

            method:"POST",
            body:formData

        });

        const data = await res.json();

        console.log(data);

        if(!res.ok){

            throw new Error(data.error || "API ERROR");

        }

        setStatus("STATUS: SUCCESS");

    }
    catch(err){

        console.error(err);

        setStatus("STATUS: ERROR");

        alert(err.message);

    }
    finally{

        isRunning = false;

    }

}


// ===============================
// GLOBAL
// ===============================

window.runAI = runAI;
