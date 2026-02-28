/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: create-nav.js
 * VERSION: v3.0.0
 * STATUS: production
 * LAST FIX: show user + credits from /auth/me
 */

const API_BASE = "https://sn-design-api.onrender.com";

/* ================= NAV BUILD ================= */

(function(){

    if(document.querySelector(".create-top-nav")) return;

    const nav=document.createElement("div");

    nav.className="create-top-nav";

    nav.innerHTML=`
        <div class="create-nav-left">
            ⭐ SN DESIGN ENGINE AI
        </div>

        <div class="create-nav-right">
            <button id="btn-credit" class="create-nav-btn">
                เติมเครดิต
            </button>
        </div>
    `;

    document.body.prepend(nav);

    requestAnimationFrame(()=>{
        document.body.style.paddingTop =
        nav.offsetHeight+"px";
    });

})();

/* ================= AUTH + USER STATUS ================= */

async function loadUserStatus(){

    try{

        const res = await fetch(`${API_BASE}/auth/me`,{
            credentials:"include",
            cache:"no-store"
        });

        if(res.status !== 200){
            window.location.replace("/login.html");
            return;
        }

        const user = await res.json();

        // USER EMAIL
        const emailEl = document.getElementById("userEmail");
        if(emailEl){
            emailEl.textContent = user.email || "-";
        }

        // USER CREDITS
        const creditEl = document.getElementById("userCredits");
        if(creditEl){
            creditEl.textContent = user.credits ?? 0;
        }

    }catch(err){

        console.error("USER LOAD ERROR:",err);
        window.location.replace("/login.html");
    }

}

loadUserStatus();

/* ================= CREDIT BUTTON ================= */

document.addEventListener("click",(e)=>{

    if(e.target.id==="btn-credit"){
        window.location.href="/payment.html";
    }

});
