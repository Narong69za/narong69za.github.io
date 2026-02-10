// ===============================
// ULTRA DANCE MOTION ENGINE
// SN DESIGN STUDIO
// ===============================

document.addEventListener("DOMContentLoaded", function () {

const videoInput = document.getElementById("videoInput");
const imageInput = document.getElementById("imageInput");

const videoPreview = document.getElementById("videoPreview");
const imagePreview = document.getElementById("imagePreview");

// ===============================
// VIDEO PREVIEW
// ===============================

videoInput.addEventListener("change", function(e){

const file = e.target.files[0];

if(!file) return;

const url = URL.createObjectURL(file);

videoPreview.innerHTML = `
<video controls autoplay muted loop>
<source src="${url}" type="${file.type}">
</video>
`;

});

// ===============================
// IMAGE PREVIEW
// ===============================

imageInput.addEventListener("change", function(e){

const file = e.target.files[0];

if(!file) return;

const url = URL.createObjectURL(file);

imagePreview.innerHTML = `
<img src="${url}" alt="preview">
`;

});

});
