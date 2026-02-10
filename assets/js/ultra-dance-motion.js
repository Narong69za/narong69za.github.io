/* ===============================
ULTRA DANCE MOTION PANEL
FULL BUILD
=============================== */

document.addEventListener("DOMContentLoaded", ()=>{

const container = document.querySelector(".dance-motion-container");

if(!container) return;

container.innerHTML = `

<section class="ultra-dance-panel">

<div class="dance-left">

<h3>Reference Dance Video</h3>
<input id="videoInput" type="file" accept="video/*">

<h3>Character Image</h3>
<input id="imageInput" type="file" accept="image/*">

</div>


<div class="dance-center">

<div class="ai-preview-frame">

<video id="videoPreview" autoplay muted loop></video>

<img id="imagePreview"/>

<div class="scan-grid"></div>
<div class="scan-line"></div>

<p class="preview-label">LIVE AI MOTION SCAN</p>

</div>

</div>


<div class="dance-right">

<h3>AI MOTION ENGINE</h3>

<ul class="ai-status">

<li>✔ motion reference detected</li>
<li>✔ pose mapping ready</li>
<li>✔ skeleton tracking</li>
<li>⏳ animation generation</li>

</ul>

<div class="ai-metrics">

<p>Tracking Accuracy</p>

<div class="progress-bar">
<span id="progressBar"></span>
</div>

</div>

</div>

</section>

`;


/* ========= LIVE PREVIEW ========= */

document.addEventListener("change", e=>{

if(e.target.id==="videoInput"){

const url = URL.createObjectURL(e.target.files[0]);
document.getElementById("videoPreview").src=url;

}

if(e.target.id==="imageInput"){

const url = URL.createObjectURL(e.target.files[0]);
document.getElementById("imagePreview").src=url;

}

});


/* ========= LIVE SCAN ANIMATION ========= */

let percent=0;

setInterval(()=>{

percent++;

if(percent>87) percent=20;

document.getElementById("progressBar").style.width = percent+"%";

},120);

});
