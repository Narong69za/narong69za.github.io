(function(){

console.log("ULTRA CORE ACTIVE");

/* AUTO NAV BUILD */

if(!document.querySelector(".global-nav")){

document.body.insertAdjacentHTML("afterbegin",`

<header class="global-nav">

<nav class="nav-center">

<a href="/index.html">Home</a>
<a href="/packages.html">Packages</a>
<a href="/services.html">Services</a>
<a href="/templates.html">Templates</a>
<a href="/seo.html">SEO</a>
<a href="/contact.html">Contact</a>

</nav>

</header>

`);

}

/* CENTER NAV FIX */

const style = document.createElement("style");

style.innerHTML = `

.global-nav{
position:fixed;
top:0;
width:100%;
background:#000;
z-index:9999;
}

.nav-center{
display:flex;
justify-content:center;
gap:40px;
padding:16px;
font-size:18px;
}

`;

document.head.appendChild(style);

/* BODY OFFSET */

document.body.style.paddingTop="70px";

})();
