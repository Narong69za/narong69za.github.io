 /**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: create-nav.js
 * VERSION: v3.5.0
 * STATUS: production
 * LAST FIX:
 * - Owner-only Payment Control
 * - Lock credit button visibility by role
 * - Admin Dashboard route support
 * =====================================================
 */

const DEV_MODE = false;

/* ================= NAV BUILD ================= */

(function(){

    if(document.querySelector(".create-top-nav")) return;

    const nav=document.createElement("div");
    nav.className="create-top-nav";

    nav.innerHTML=`

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
        document.body.style.paddingTop =
        nav.offsetHeight+"px";
    });

})();

/* ================= USER STATUS LOAD ================= */

async function loadUserStatus(){

    const creditBtn = document.getElementById("btn-credit");
    const adminBtn  = document.getElementById("btn-admin");

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

        console.log("USER LOADED:", user);

        const role = (user.role || "").toLowerCase();

        /* ================= OWNER CONTROL ================= */

        if(role === "owner"){

            // 🔥 Owner เห็นทุกระบบ
            if(creditBtn) creditBtn.style.display="inline-block";
            if(adminBtn)  adminBtn.style.display="inline-block";

        } else {

            // 🔒 User ธรรมดา เห็นแค่เติมเครดิต
            if(creditBtn) creditBtn.style.display="inline-block";

            // ซ่อน admin
            if(adminBtn) adminBtn.style.display="none";
        }

    }catch(err){
        console.warn("USER LOAD ERROR:",err);
    }
}

document.addEventListener("DOMContentLoaded", loadUserStatus);

/* ================= BUTTON NAVIGATION ================= */

document.addEventListener("click",(e)=>{

    if(e.target.id==="btn-credit"){
        window.location.href="/payment.html";
    }

    if(e.target.id==="btn-admin"){
        window.location.href="/payment.dashboard.html";
    }

});
