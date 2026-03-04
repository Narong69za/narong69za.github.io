/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: create-nav.js
 * VERSION: v9.1.0
 * STATUS: production-hardened
 * LAYER: frontend-navigation
 * RESPONSIBILITY:
 * - build balanced top navigation
 * - role-based visibility control
 * - left/right button separation
 * LAST FIX:
 * - separated credit (left) / admin (right)
 * - enforced equal button sizing
 * - improved layout stability
 * =====================================================
 */

const DEV_MODE = false;

/* ================= NAV BUILD ================= */

(function(){

    if(document.querySelector(".create-top-nav")) return;

    const nav = document.createElement("div");
    nav.className = "create-top-nav";

    nav.innerHTML = `
        <div class="create-nav-left">
            <button id="btn-credit" class="nav-btn" style="display:none;">
                💎 เติมเครดิต
            </button>
        </div>

        <div class="create-nav-right">
            <button id="btn-admin" class="nav-btn" style="display:none;">
                ⚙ PAYMENT CONTROL
            </button>
        </div>
    `;

    document.body.prepend(nav);

    requestAnimationFrame(()=>{
        document.body.style.paddingTop = nav.offsetHeight + "px";
    });

})();

/* ================= STYLE INJECTION ================= */

(function(){

    if(document.getElementById("nav-balance-style")) return;

    const style = document.createElement("style");
    style.id = "nav-balance-style";

    style.innerHTML = `
        .create-top-nav{
            position: fixed;
            top:0;
            left:0;
            width:100%;
            display:flex;
            justify-content:space-between;
            align-items:center;
            padding:12px 24px;
            background:rgba(0,0,0,0.85);
            backdrop-filter: blur(10px);
            z-index:9999;
        }

        .create-nav-left,
        .create-nav-right{
            display:flex;
            align-items:center;
        }

        .nav-btn{
            min-width:200px;
            height:48px;
            border-radius:30px;
            font-weight:600;
            font-size:14px;
            letter-spacing:0.5px;
            cursor:pointer;
        }
    `;

    document.head.appendChild(style);

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
        const role = (user.role || "").toLowerCase();

        if(role === "owner"){
            if(creditBtn) creditBtn.style.display="inline-flex";
            if(adminBtn)  adminBtn.style.display="inline-flex";
        } else {
            if(creditBtn) creditBtn.style.display="inline-flex";
            if(adminBtn)  adminBtn.style.display="none";
        }

    }catch(err){
        console.warn("USER LOAD ERROR:",err);
    }
}

document.addEventListener("DOMContentLoaded", loadUserStatus);

/* ================= BUTTON NAVIGATION ================= */

document.addEventListener("click",(e)=>{

    const target = e.target.closest("button");
    if(!target) return;

    if(target.id==="btn-credit"){
        window.location.href="/payment.html";
        return;
    }

    if(target.id==="btn-admin"){
        window.location.href="/admin/payment.dashboard.html";
        return;
    }

});
