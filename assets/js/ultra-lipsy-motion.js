const videoInput = document.getElementById("videoInput");
const audioInput = document.getElementById("audioInput");

const videoPreview = document.getElementById("videoPreview");
const audioPreview = document.getElementById("audioPreview");

if(videoInput){

videoInput.addEventListener("change",function(){

const file = this.files[0];

if(file){

videoPreview.innerHTML =
`<video controls autoplay muted loop>
<source src="${URL.createObjectURL(file)}">
</video>`;

startLipScan();

}

});

}

if(audioInput){

audioInput.addEventListener("change",function(){

const file = this.files[0];

if(file){

audioPreview.innerHTML =
`<audio controls>
<source src="${URL.createObjectURL(file)}">
</audio>`;

}

});

}

function startLipScan(){

const scanLine = document.createElement("div");

scanLine.style.position="absolute";
scanLine.style.width="100%";
scanLine.style.height="2px";
scanLine.style.background="rgba(0,255,255,.6)";
scanLine.style.animation="scanMove 3s linear infinite";

videoPreview.appendChild(scanLine);

}
