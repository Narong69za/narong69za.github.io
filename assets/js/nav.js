document.addEventListener("DOMContentLoaded", () => {

const nav = `
<header class="sn-nav">
<div class="sn-nav-inner">
<nav>
<ul class="sn-menu">
<li><a href="index.html">Home</a></li>
<li><a href="packages.html">Packages</a></li>
<li><a href="services.html">Services</a></li>
<li><a href="templates.html">Templates</a></li>
<li><a href="seo.html">SEO</a></li>
<li><a href="contact.html">Contact</a></li>
</ul>
</nav>
</div>
</header>
`;

document.body.insertAdjacentHTML("afterbegin",nav);

/* ACTIVE LINK */

const path = location.pathname.toLowerCase();

document.querySelectorAll(".sn-menu a").forEach(a=>{

if(path.endsWith(a.getAttribute("href")) ||
(path === "/" && a.getAttribute("href")==="index.html")){

a.classList.add("active");

}

});

});
