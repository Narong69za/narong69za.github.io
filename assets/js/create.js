/* =====================================================
SN DESIGN ENGINE AI
ULTRA AUTO LOGIN STATE + RUNWAY ENGINE
FULL VERSION FINAL
===================================================== */

const API_URL = "https://sn-design-api.onrender.com/api/render";

let STATE = {
    engine:null,
    alias:null
};

/* ===============================
LOGIN STATE ULTRA
=============================== */

function getUserId(){

    // DEV BYPASS
    const dev = localStorage.getItem("DEV_BYPASS");

    if(dev === "true"){
        return "DEV-BYPASS";
    }

    return localStorage.getItem("USER_ID");
}


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
PREVIEW
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

    if(file.type.startsWith("video/")){
        videoEl.src=url;
        videoEl.load();
        videoEl.style.display="block";
    }
    else if(file.type.startsWith("image/")){
        imageEl.src=url;
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
GLOW ACTIVE FINAL
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

        STATE.engine="runwayml";
        STATE.alias=btn.dataset.alias;

        console.log("MODEL:",STATE);

    });

});


/* ===============================
GENERATE RUNWAY
=============================== */

async function runGenerate(){

    const userId = getUserId();

    if(!userId){

        alert("ยังไม่ได้ Login Google");
        return;
    }

    if(!STATE.alias){

        alert("เลือก Model ก่อน");
        return;
    }

    try{

        statusEl.innerText="STATUS: PROCESSING";

        const formData = new FormData();

        formData.append("engine","runwayml");
        formData.append("alias",STATE.alias);
        formData.append("type","video");

        const promptEl = document.querySelector("textarea");

        formData.append(
            "prompt",
            promptEl?.value || "SN DESIGN TEST"
        );

        if(fileA?.files[0]){
            formData.append("fileA",fileA.files[0]);
        }

        if(fileB?.files[0]){
            formData.append("fileB",fileB.files[0]);
        }

        const res = await fetch(API_URL,{

            method:"POST",

            headers:{
                "x-user-id": userId
            },

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

document.querySelectorAll(".engine-btn")[0]
?.addEventListener("click",runGenerate);


/* ===============================
INIT
=============================== */

initGlowButtons();
