/* ======================================
ULTRA LIVE MOTION UI
SN DESIGN STUDIO
FULL REPLACE VERSION
====================================== */

document.addEventListener("DOMContentLoaded", function(){

const videoInput = document.getElementById("videoInput");
const imageInput = document.getElementById("imageInput");

const videoPreview = document.getElementById("videoPreview");
const imagePreview = document.getElementById("imagePreview");

let scanLine;
let progressBar;
let statusList;

/* =========================
CREATE SCAN UI
========================= */

function createScanUI(){

    // scan line
    scanLine = document.createElement("div");
    scanLine.style.position = "absolute";
    scanLine.style.left = "0";
    scanLine.style.width = "100%";
    scanLine.style.height = "2px";
    scanLine.style.background = "linear-gradient(90deg,#00ffff,#ff0044)";
    scanLine.style.boxShadow = "0 0 10px #00ffff";
    scanLine.style.top = "0";
    scanLine.style.animation = "scanMove 2.5s linear infinite";

    // progress bar
    progressBar = document.createElement("div");
    progressBar.style.marginTop = "20px";
    progressBar.style.fontSize = "14px";
    progressBar.style.opacity = "0.9";
    progressBar.innerText = "AI PROCESSING — 0%";

    // status list
    statusList = document.querySelector("ul");

    if(!document.getElementById("ultra-scan-style")){
        const style = document.createElement("style");
        style.id="ultra-scan-style";
        style.innerHTML = `
        @keyframes scanMove{
            0%{top:0}
            100%{top:100%}
        }
        `;
        document.head.appendChild(style);
    }

}

/* =========================
VIDEO PREVIEW
========================= */

videoInput.addEventListener("change", function(){

    const file = this.files[0];
    if(!file) return;

    videoPreview.innerHTML = "";

    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.controls = true;

    videoPreview.appendChild(video);

    startUltraScan();

});


/* =========================
IMAGE PREVIEW
========================= */

imageInput.addEventListener("change", function(){

    const file = this.files[0];
    if(!file) return;

    imagePreview.innerHTML = "";

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);

    imagePreview.appendChild(img);

    startUltraScan();

});


/* =========================
ULTRA AI SCAN ENGINE
========================= */

function startUltraScan(){

    if(!scanLine){
        createScanUI();
    }

    // attach scan line to previews
    videoPreview.style.position="relative";
    imagePreview.style.position="relative";

    if(videoPreview.children.length){
        videoPreview.appendChild(scanLine);
    }
    if(imagePreview.children.length){
        imagePreview.appendChild(scanLine);
    }

    document.querySelector(".container").appendChild(progressBar);

    simulateAI();
}


/* =========================
SIMULATE AI PROCESS
========================= */

function simulateAI(){

    let progress = 0;

    const steps = [
        "Detecting motion...",
        "Mapping skeleton...",
        "Tracking pose...",
        "Generating animation...",
        "READY"
    ];

    let stepIndex = 0;

    const interval = setInterval(()=>{

        progress += 2;
        progressBar.innerText = "AI PROCESSING — " + progress + "%";

        if(progress % 20 === 0 && statusList){

            if(stepIndex < steps.length){

                const li = document.createElement("li");
                li.innerText = "✔ " + steps[stepIndex];
                statusList.appendChild(li);

                stepIndex++;

            }
        }

        if(progress >= 100){

            clearInterval(interval);

            progressBar.innerText = "AI PROCESSING — COMPLETE";

            if(scanLine){
                scanLine.style.animation = "none";
                scanLine.style.opacity = "0";
            }
        }

    },80);

}

});
