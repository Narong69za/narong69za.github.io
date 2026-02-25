// ===============================
// ULTRA ENGINE CONTROL FINAL
// ADD ONLY VERSION
// DO NOT CHANGE UI LAYOUT
// ===============================

const API_URL = "https://sn-design-api.onrender.com/api/render";

let isRunning = false;


// ===============================
// UTILITY UI STATE
// ===============================

function lockButtons(lock=true){

    const buttons = document.querySelectorAll("button");

    buttons.forEach(btn=>{

        if(btn.innerText.includes("สร้าง")){
            btn.disabled = lock;

            if(lock){
                btn.style.opacity="0.6";
                btn.style.pointerEvents="none";
            }else{
                btn.style.opacity="1";
                btn.style.pointerEvents="auto";
            }
        }

    });

}


// glow แบบไม่พัง event
function glowActive(button){

    document.querySelectorAll("button").forEach(b=>{
        b.style.boxShadow="none";
    });

    if(button){
        button.style.boxShadow="0 0 20px #00ffea";
    }
}


// ===============================
// RUN AI
// ===============================

async function runAI(engine,btnElement){

    if(isRunning) return;

    const btn = btnElement || window.event?.target;

    glowActive(btn);

    const fileA = document.getElementById("fileSource")?.files?.[0];
    const fileB = document.getElementById("fileTarget")?.files?.[0];
    const prompt = document.getElementById("prompt")?.value || "";

    // ===============================
    // VALIDATE
    // ===============================

    if(!fileA){

        alert("ต้องเลือกไฟล์ก่อน");

        return;
    }

    const formData = new FormData();

    formData.append("engine", engine);
    formData.append("alias", engine);
    formData.append("type", "video");
    formData.append("prompt", prompt);

    // 🔥 ต้องตรง backend multer
    formData.append("fileA", fileA);

    if(fileB){
        formData.append("fileB", fileB);
    }

    try{

        isRunning = true;

        lockButtons(true);

        const res = await fetch(API_URL,{

            method:"POST",
            body:formData

        });

        const data = await res.json();

        console.log("AI RESULT:", data);

        if(!res.ok){

            throw new Error(data.error || "Render failed");

        }

        console.log("SUCCESS");

    }catch(err){

        console.error("ERROR:", err);

        alert(err.message);

    }finally{

        isRunning = false;

        lockButtons(false);

    }

}


// ===============================
// GLOBAL EXPORT
// ===============================

window.runAI = runAI;
