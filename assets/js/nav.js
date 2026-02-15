/* ===============================
ULTRA NAV AUTO CORE
AUTO INJECT GLOBAL NAV
=============================== */

document.addEventListener("DOMContentLoaded", function () {

if(document.querySelector(".global-nav")) return;

const navHTML = `
<header class="global-nav">
<nav class="nav-wrap">
<div class="nav-menu">
<a href="index.html">Home</a>
<a href="packages.html">Packages</a>
<a href="services.html">Services</a>
<a href="templates.html">Templates</a>
<a href="seo.html">SEO</a>
<a href="contact.html">Contact</a>
</div>
</nav>
</header>
`;

document.body.insertAdjacentHTML("afterbegin", navHTML);


/* ===============================
ULTRA NAV LOCK (EVENT SAFE)
=============================== */

const nav = document.querySelector(".global-nav");

if(nav){

nav.addEventListener("click", function(e){

if(e.target.tagName !== "A"){
e.stopPropagation();
}

}, true);   // <<< ตัวนี้ต้องอยู่

}


/* ===============================
ULTRA NAV ACTIVE STATE ENGINE
=============================== */

const path = window.location.pathname.toLowerCase();

document.querySelectorAll(".nav-menu a").forEach(link => {

const href = link.getAttribute("href").toLowerCase();

if(path.endsWith(href)){
link.classList.add("nav-active");
}

if((path === "/" || path.endsWith("index.html")) && href === "index.html"){
link.classList.add("nav-active");
}

});


/* ===============================
NAV AUTO HIDE (mobile scroll)
=============================== */

let lastScroll = 0;

window.addEventListener("scroll", () => {

const nav = document.querySelector(".global-nav");
if(!nav) return;

const current = window.pageYOffset;

if(current > lastScroll && current > 80){
nav.style.transform = "translateY(-100%)";
}else{
nav.style.transform = "translateY(0)";
}

lastScroll = current;

});

});
