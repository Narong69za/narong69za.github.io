/* ======================================================
SN DESIGN ULTRA NAV CORE
REBUILD FINAL VERSION
====================================================== */

document.addEventListener("DOMContentLoaded", () => {

/* ======================================
STOP IF NAV EXISTS
====================================== */

if(document.querySelector(".global-nav")) return;


/* ======================================
NAV HTML STRUCTURE
====================================== */

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


/* ======================================
INJECT NAV
====================================== */

document.body.insertAdjacentHTML("afterbegin", navHTML);


/* ======================================
FORCE CENTER ALIGN (NO CSS DEPENDENCY)
====================================== */

const nav = document.querySelector(".global-nav");
const wrap = document.querySelector(".nav-wrap");
const menu = document.querySelector(".nav-menu");

if(nav && wrap && menu){

nav.style.display="flex";
nav.style.justifyContent="center";

wrap.style.display="flex";
wrap.style.justifyContent="center";
wrap.style.width="100%";

menu.style.display="flex";
menu.style.justifyContent="center";
menu.style.alignItems="center";

}


/* ======================================
ACTIVE MENU SYSTEM
====================================== */

const currentPath = window.location.pathname.toLowerCase();

document.querySelectorAll(".nav-menu a").forEach(link => {

const href = link.getAttribute("href").toLowerCase();

if(currentPath.endsWith(href)){
link.classList.add("nav-active");
}

if((currentPath === "/" || currentPath.endsWith("index.html")) && href === "index.html"){
link.classList.add("nav-active");
}

});


/* ======================================
AUTO HIDE NAV (MOBILE SCROLL)
====================================== */

let lastScroll = 0;

window.addEventListener("scroll", () => {

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
