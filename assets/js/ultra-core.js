document.addEventListener("DOMContentLoaded",()=>{

if(!document.querySelector(".global-nav")){

const nav=`
<header class="global-nav">
<nav class="nav-wrap">
<div class="nav-menu">
<a href="/index.html">Home</a>
<a href="/packages.html">Packages</a>
<a href="/services.html">Services</a>
<a href="/templates.html">Templates</a>
<a href="/seo.html">SEO</a>
<a href="/contact.html">Contact</a>
</div>
</nav>
</header>
`;

document.body.insertAdjacentHTML("afterbegin",nav);

}

});
/* ==================================================
ULTRA FINAL CLICK ENGINE
FORCE REBIND ALL CTA
================================================== */

document.addEventListener("DOMContentLoaded", () => {

console.log("ULTRA CLICK ENGINE ACTIVE");

/* FORCE ENABLE ALL BUTTON */

document.querySelectorAll("a, button, .btn-primary").forEach(el => {

el.style.pointerEvents = "auto";
el.style.zIndex = "9999";

/* remove broken handler */
el.onclick = null;

/* debug click */
el.addEventListener("click", function(e){

console.log("CLICK OK:", this);

});

});


/* FIX LINK NAVIGATION NOT WORKING */

document.querySelectorAll("a[href]").forEach(link=>{

link.addEventListener("click", function(e){

const href = this.getAttribute("href");

if(!href) return;

if(href.startsWith("#")) return;

window.location.href = href;

});

});

});
