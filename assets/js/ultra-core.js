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
