/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO | MODULE: create-nav.js
 * VERSION: v1.1.2 (Redirect Domain Fixed)
 * =====================================================
 */
const API_BASE = window.CONFIG ? window.CONFIG.API_BASE_URL : "https://api.sn-designstudio.dev";
const FRONTEND_BASE = "https://sn-designstudio.dev"; // กำหนดโดเมนหน้าบ้านให้ชัดเจน
const DEV_MODE = false;

/* ================= STYLE INJECT ================= */
(function(){
    if(document.getElementById("create-nav-style")) return;
    const style = document.createElement("style");
    style.id="create-nav-style";
    style.innerHTML=`
        .create-top-nav{
            position:fixed; top:0; left:0; right:0;
            display:flex; justify-content:space-between; align-items:center;
            padding:10px 20px; z-index:9999;
            background:rgba(10,10,14,0.95); backdrop-filter:blur(10px);
            border-bottom:1px solid rgba(0,255,200,0.2);
        }
        .create-nav-left, .create-nav-right{ display:flex; gap:10px; }
        .credit-btn-premium{
            font-size:14px; padding:10px 18px; border-radius:30px;
            border:1px solid rgba(0,255,200,0.4);
            background:linear-gradient(90deg,#00ffd5,#00aaff);
            color:#000; font-weight:600; cursor:pointer;
            transition:all .25s ease; display:none; align-items:center; gap:8px;
        }
        .credit-btn-premium:hover{
            transform:translateY(-2px);
            box-shadow:0 0 14px rgba(0,255,200,0.7);
        }
    `;
    document.head.appendChild(style);
})();

/* ================= NAV BUILD ================= */
(function(){
    if(document.querySelector(".create-top-nav")) return;
    const nav=document.createElement("div");
    nav.className="create-top-nav";
    nav.innerHTML=`
    <div class="create-nav-left">
        <button id="btn-credit" class="credit-btn-premium">
             <span id="user-credits-nav">0</span> Credits
        </button>
    </div>
    <div class="create-nav-right">
        <button id="btn-admin" class="credit-btn-premium">
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
    const adminBtn  = document.getElementById("admin-btn"); // ตรวจสอบ ID ให้ตรงกับ CSS
    const creditTextNav = document.getElementById("user-credits-nav");
    const creditTextBody = document.getElementById("userCredits"); // สำหรับหน้า create.html

    const token = localStorage.getItem("token");
    if(!token) return;

    try{
        const res = await fetch(`${API_BASE}/auth/me`,{
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            cache:"no-store"
        });

        if(!res.ok){
            // แก้ไข: ระบุ URL เต็มสำหรับหน้า Login
            if(!DEV_MODE && res.status===401) window.location.href = `${FRONTEND_BASE}/login.html`;
            return;
        }

        const user = await res.json();
        const credits = user.credits || 0;
        
        if(creditTextNav) creditTextNav.innerText = credits;
        if(creditTextBody) creditTextBody.innerText = credits;

        const role = (user.role || "").toLowerCase();
        if(creditBtn) creditBtn.style.display="inline-flex";
        
        // ตรวจสอบทั้งปุ่ม admin-btn และ btn-admin ตามที่พี่ตั้งค่าไว้
        const adminElement = adminBtn || document.getElementById("btn-admin");
        if(role === "owner" || role === "admin"){
            if(adminElement) adminElement.style.display="inline-flex";
        }

    }catch(err){
        console.warn("USER LOAD ERROR:",err);
    }
}

document.addEventListener("DOMContentLoaded", loadUserStatus);

document.addEventListener("click",(e)=>{
    const btn = e.target.closest('button');
    if(!btn) return;

    // แก้ไข: ระบุ Absolute URL เพื่อป้องกันการหลงโดเมน
    if(btn.id === "btn-credit") {
        window.location.href = `${FRONTEND_BASE}/payment.html`;
    }
    if(btn.id === "btn-admin") {
        window.location.href = `${FRONTEND_BASE}/admin/payment.dashboard.html`;
    }
});

