/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: create-nav.js
 * VERSION: v9.0.0
 * STATUS: production-hardened
 * LAYER: frontend-navigation
 * RESPONSIBILITY:
 * - build top navigation
 * - role-based visibility control
 * - secure route navigation
 * DEPENDS ON:
 * - API_BASE (config.js)
 * LAST FIX:
 * - fixed admin route path (/admin/payment.dashboard.html)
 * - hardened click detection
 * - prevented duplicate nav injection
 * - improved role safety check
 * =====================================================
 */

const DEV_MODE = false;

/* ================= NAV BUILD ================= */

(function(){

    if(document.querySelector(".create-top-nav")) return;

    const nav = document.createElement("div");
    nav.className = "create-top-nav";

    nav.innerHTML = `
        <div class="create-nav-right">
            <button id="btn-credit" class="credit-btn-premium" style="display:none;">
                💎 เติมเครดิต
            </button>

            <button id="btn-admin" class="credit-btn-premium" style="display:none;">
                ⚙ PAYMENT CONTROL
            </button>
        </div>
    `;

    document.body.prepend(nav);

    requestAnimationFrame(()=>{
        document.body.style.paddingTop = nav.offsetHeight + "px";
    });

})();

/* ================= USER STATUS LOAD ================= */

async function loadUserStatus(){

    const creditBtn = document.getElementById("btn-credit");
    const adminBtn  = document.getElementById("btn-admin");

    try{

        if(typeof API_BASE === "undefined"){
            console.error("API_BASE missing");
            return;
        }

        const res = await fetch(`${API_BASE}/auth/me`,{
            credentials: "include",
            cache: "no-store"
        });

        if(!res.ok){

            if(!DEV_MODE && res.status === 401){
                window.location.href = "/login.html";
            }

            return;
        }

        const user = await res.json();

        console.log("USER LOADED:", user);

        const role = (user.role || "").toLowerCase();

        /* ================= OWNER CONTROL ================= */

        if(role === "owner"){

            if(creditBtn) creditBtn.style.display = "inline-block";
            if(adminBtn)  adminBtn.style.display  = "inline-block";

        } else {

            if(creditBtn) creditBtn.style.display = "inline-block";
            if(adminBtn)  adminBtn.style.display  = "none";
        }

    }catch(err){
        console.warn("USER LOAD ERROR:", err);
    }
}

document.addEventListener("DOMContentLoaded", loadUserStatus);

/* ================= BUTTON NAVIGATION ================= */

document.addEventListener("click", (e)=>{

    const target = e.target.closest("button");
    if(!target) return;

    if(target.id === "btn-credit"){
        window.location.href = "/payment.html";
        return;
    }

    if(target.id === "btn-admin"){
        // 🔥 FIXED PATH
        window.location.href = "/admin/payment.dashboard.html";
        return;
    }

});
