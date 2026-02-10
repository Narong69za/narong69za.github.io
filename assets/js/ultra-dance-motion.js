document.addEventListener("DOMContentLoaded", () => {

console.log("ULTRA MOTION JS LOADED");

const videoInput = document.getElementById("videoInput");
const imageInput = document.getElementById("imageInput");

const videoPreview = document.getElementById("videoPreview");
const imagePreview = document.getElementById("imagePreview");

console.log(videoInput,imageInput,videoPreview,imagePreview);


/* VIDEO */

if(videoInput){

videoInput.addEventListener("change",(e)=>{

console.log("VIDEO CHANGE");

const file = e.target.files[0];

if(!file) return;

const url = URL.createObjectURL(file);

videoPreview.innerHTML = `
<video controls autoplay muted loop style="width:100%">
<source src="${url}">
</video>
`;

});

}


/* IMAGE */

if(imageInput){

imageInput.addEventListener("change",(e)=>{

console.log("IMAGE CHANGE");

const file = e.target.files[0];

if(!file) return;

const url = URL.createObjectURL(file);

imagePreview.innerHTML = `
<img src="${url}" style="width:100%">
`;

});

}

});
