/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: create-nav.js
 * VERSION: v3.4.0
 * STATUS: production
 * LAST FIX: removed duplicated broken logic + stable account rendering
 */

const DEV_MODE = false;

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
            <button id="btn-credit" class="credit-btn-premium">
                💎 เติมเครดิต
            </button>
        </div>
    `;

    document.body.prepend(nav);

    requestAnimationFrame(()=>{
        document.body.style.paddingTop =
        nav.offsetHeight+"px";
    });

})();

/* ================= USER STATUS LOAD ================= */

async function loadUserStatus(){

    const emailEl = document.getElementById("userEmail");
    const creditEl = document.getElementById("userCredits");
    const roleEl = document.getElementById("userRole");
    const shortEl = document.getElementById("userShort");

    try{

        const res = await fetch(`${API_BASE}/auth/me`,{
            credentials:"include",
            cache:"no-store"
        });

        if(!res.ok){
            if(!DEV_MODE && res.status===401){
                window.location.href="/login.html";
            }
            return;
        }

        const user = await res.json();

        /* ===== HEADER BRAND ===== */

        const brandName = "SN DESIGN";

        if(shortEl){
            if(user.role && user.role.toLowerCase()==="owner"){
                shortEl.textContent="👑 OWNER · "+brandName;
                shortEl.classList.add("owner-header");
            }else{
                shortEl.textContent=brandName;
            }
        }

        /* ===== ACCOUNT CARD ===== */

        if(emailEl){
            emailEl.textContent = user.email || "-";
        }

        if(roleEl){
            roleEl.textContent = (user.role || "-").toUpperCase();
        }

        if(creditEl){
            creditEl.textContent = user.credits ?? 0;
        }

        console.log("USER LOADED:", user);

    }catch(err){
        console.warn("USER LOAD ERROR:",err);
    }
}

document.addEventListener("DOMContentLoaded", loadUserStatus);

/* ================= CREDIT BUTTON ================= */

document.addEventListener("click",(e)=>{
    if(e.target.id==="btn-credit"){
        window.location.href="/payment.html";
    }
});
