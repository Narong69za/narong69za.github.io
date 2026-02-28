/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: create-nav.js
 * VERSION: v3.3.0
 * STATUS: production
 * LAST FIX: premium dashboard display (short username + role support)
 */

/* ================= DEV MODE FLAG ================= */
/* true = ไม่บังคับ login redirect */
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

/* ================= USER STATUS LOAD ================= */

async function loadUserStatus(){

    const emailEl = document.getElementById("userEmail");
    const creditEl = document.getElementById("userCredits");
    const roleEl = document.getElementById("userRole");
    const shortEl = document.getElementById("userShort");

    try{

        if (typeof API_BASE === "undefined") {
            console.error("API_BASE not found. Ensure config.js is loaded first.");
            return;
        }

        const res = await fetch(`${API_BASE}/auth/me`,{
            credentials:"include",
            cache:"no-store"
        });

        if(!res.ok){

            console.warn("AUTH STATUS:", res.status);

            if(emailEl) emailEl.textContent = "NOT LOGGED";
            if(creditEl) creditEl.textContent = "-";
            if(roleEl) roleEl.textContent = "-";
            if(shortEl) shortEl.textContent = "-";

            if(!DEV_MODE && res.status === 401){
                window.location.href="/login.html";
            }

            return;
        }

        const user = await res.json();

        /* ===== EMAIL ===== */
        if(emailEl){
            emailEl.textContent = user.email || "-";
        }

        /* ===== SHORT USERNAME (ก่อน @) ===== */
        if(shortEl){

    const baseName = user.email
        ? user.email.split("@")[0].split(".")[0]
        : "USER";

    const brandName = "SN DESIGN";

    if(user.role && user.role.toLowerCase() === "owner"){
        shortEl.textContent = "👑 OWNER · " + brandName;
    }else{
        shortEl.textContent = brandName;
    }

}

        /* ===== ROLE ===== */
        if(roleEl){
            roleEl.textContent = (user.role || "-").toUpperCase();
        }

        /* ===== CREDITS ===== */
        if(creditEl){
            creditEl.textContent = user.credits ?? 0;
        }

        console.log("USER LOADED:", user);

    }catch(err){

        console.warn("USER LOAD ERROR:", err);

        if(emailEl) emailEl.textContent = "ERROR";
        if(creditEl) creditEl.textContent = "-";
        if(roleEl) roleEl.textContent = "-";
        if(shortEl) shortEl.textContent = "-";

    }

}

document.addEventListener("DOMContentLoaded", loadUserStatus);

/* ================= CREDIT BUTTON ================= */

document.addEventListener("click",(e)=>{

    if(e.target.id==="btn-credit"){
        window.location.href="/payment.html";
    }

});
