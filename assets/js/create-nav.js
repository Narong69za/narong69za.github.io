/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: create-nav.js
 * VERSION: v3.0.1
 * STATUS: production
 * LAST FIX: remove forced login redirect, stabilize user status load
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

/* ================= USER STATUS LOAD (NO REDIRECT) ================= */

async function loadUserStatus(){

    try{

        const res = await fetch(`${API_BASE}/auth/me`,{
            credentials:"include",
            cache:"no-store"
        });

        if(!res.ok){
            console.warn("AUTH STATUS:", res.status);
            return; // ❌ ไม่ redirect
        }

        const user = await res.json();

        const emailEl = document.getElementById("userEmail");
        if(emailEl){
            emailEl.textContent = user.email || "-";
        }

        const creditEl = document.getElementById("userCredits");
        if(creditEl){
            creditEl.textContent = user.credits ?? 0;
        }

    }catch(err){
        console.warn("USER LOAD ERROR:", err);
        // ❌ ไม่ redirect
    }

}

document.addEventListener("DOMContentLoaded", loadUserStatus);

/* ================= CREDIT BUTTON ================= */

document.addEventListener("click",(e)=>{

    if(e.target.id==="btn-credit"){
        window.location.href="/payment.html";
    }

});
