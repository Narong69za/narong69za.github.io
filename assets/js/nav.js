/* ===============================
SN DESIGN ULTRA NAV CORE
REBUILD FINAL
=============================== */

document.addEventListener("DOMContentLoaded",()=>{

if(document.querySelector(".sn-nav")) return;

const nav = `
<header class="sn-nav">
<div class="sn-nav-inner">

<a class="sn-logo" href="index.html">SN DESIGN</a>

<nav class="sn-menu">

<a href="index.html">Home</a>
<a href="packages.html">Packages</a>
<a href="services.html">Services</a>
<a href="templates.html">Templates</a>
<a href="seo.html">SEO</a>
<a href="contact.html">Contact</a>

</nav>

</div>
</header>
`;

document.body.insertAdjacentHTML("afterbegin",nav);


/* ACTIVE MENU */

const path = location.pathname.toLowerCase();

document.querySelectorAll(".sn-menu a").forEach(a=>{

if(path.endsWith(a.getAttribute("href"))){
a.classList.add("nav-active");
}

if(path==="/" && a.getAttribute("href")==="index.html"){
a.classList.add("nav-active");
}

});

});
