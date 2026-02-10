/* =================================
ULTRA DANCE MOTION ENGINE
SN DESIGN STUDIO
ADD ONLY SAFE
================================= */

document.addEventListener("DOMContentLoaded", () => {

const videoInput = document.getElementById("videoInput");
const imageInput = document.getElementById("imageInput");

const videoPreview = document.getElementById("videoPreview");
const imagePreview = document.getElementById("imagePreview");


/* =========================
VIDEO PREVIEW
========================= */

if(videoInput){

videoInput.addEventListener("change", function(){

const file = this.files[0];

if(!file) return;

const url = URL.createObjectURL(file);

videoPreview.innerHTML = `
<video controls autoplay muted loop>
<source src="${url}" type="${file.type}">
</video>
`;

});

}


/* =========================
IMAGE PREVIEW
========================= */

if(imageInput){

imageInput.addEventListener("change", function(){

const file = this.files[0];

if(!file) return;

const url = URL.createObjectURL(file);

imagePreview.innerHTML = `
<img src="${url}" alt="Character Preview">
`;

});

}


/* =========================
ULTRA FAKE LIVE SCAN EFFECT
========================= */

setInterval(()=>{

const status = document.querySelectorAll(".ai-status");

status.forEach(el=>{

el.classList.toggle("nav-active");

});

},2000);


});
