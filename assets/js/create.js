/* =====================================================
SN DESIGN ENGINE AI
create.js — FINAL ENGINE CORE
LOCK UI LAYOUT / FIX LOGIC ONLY
===================================================== */


/* ===============================
API
=============================== */

const API_URL = "https://sn-design-api.onrender.com/api/render";


/* ===============================
STATE
=============================== */

let STATE = {
    engine:null,
    alias:null
};


/* ===============================
DOM
=============================== */

const fileA = document.getElementById("fileA");
const fileB = document.getElementById("fileB");

const previewRedVideo = document.getElementById("preview-red-video");
const previewRedImage = document.getElementById("preview-red-image");

const previewBlueVideo = document.getElementById("preview-blue-video");
const previewBlueImage = document.getElementById("preview-blue-image");

const statusEl = document.getElementById("status");


/* ===============================
PREVIEW SYSTEM (LOCK)
=============================== */

function preview(file, videoEl, imageEl){

    if(!file) return;

    const url = URL.createObjectURL(file);

    if(videoEl){
        videoEl.pause?.();
        videoEl.style.display="none";
    }

    if(imageEl){
        imageEl.style.display="none";
    }

    if(file.type.startsWith("video/") && videoEl){

        videoEl.src = url;
        videoEl.load();
        videoEl.style.display="block";
    }
    else if(file.type.startsWith("image/") && imageEl){

        imageEl.src = url;
        imageEl.style.display="block";
    }
}

fileA?.addEventListener("change",()=>{
    preview(fileA.files[0],previewRedVideo,previewRedImage);
});

fileB?.addEventListener("change",()=>{
    preview(fileB.files[0],previewBlueVideo,previewBlueImage);
});


/* ===============================
GREEN GLOW ACTIVE (FINAL LOCK)
=============================== */

function initGlowButtons(){

    const buttons = document.querySelectorAll(
        ".model-btn, .cta-btn, .engine-btn"
    );

    buttons.forEach(btn=>{

        btn.addEventListener("click",function(){

            const group = this.closest(".engine-box") || document;

            group.querySelectorAll(".active")
                 .forEach(el=>el.classList.remove("active"));

            this.classList.add("active");

        });

    });

}


/* ===============================
MODEL SELECT
=============================== */

document.querySelectorAll(".model-btn").forEach(btn=>{

    btn.addEventListener("click",()=>{

        STATE.engine = "runwayml";
        STATE.alias = btn.dataset.alias || "image_to_video";

        console.log("MODEL SELECT:",STATE);

    });

});


/* ===============================
GENERATE RUNWAY
=============================== */

async function runGenerate(){

    if(!STATE.alias){

        alert("เลือก Model ก่อน");
        return;
    }

    if(!fileA?.files[0]){

        alert("ต้องเลือกไฟล์ก่อน");
        return;
    }

    try{

        statusEl.innerText="STATUS: PROCESSING";

        const formData = new FormData();

        formData.append("engine","runwayml");
        formData.append("alias",STATE.alias);
        formData.append("type","video");
        formData.append("prompt","DEV RUNWAY");

        formData.append("fileA",fileA.files[0]);

        if(fileB?.files[0]){
            formData.append("fileB",fileB.files[0]);
        }

        const res = await fetch(API_URL,{
            method:"POST",
            body:formData
        });

        const data = await res.json();

        console.log("RUNWAY RESPONSE:",data);

        statusEl.innerText="STATUS: SUCCESS";

    }catch(err){

        console.error(err);

        statusEl.innerText="STATUS: ERROR";

    }

}


/* ===============================
ENGINE BUTTON
=============================== */

document.querySelectorAll(".engine-btn")[0]
?.addEventListener("click",runGenerate);


/* ===============================
INIT
=============================== */

initGlowButtons();
