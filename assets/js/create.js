// =====================================================
// SN DESIGN ENGINE NAV (CREATE PAGE ONLY)
// RESTORE STABLE VERSION
// DO NOT TOUCH GLOBAL nav.js
// =====================================================

const API_BASE = "https://sn-design-api.onrender.com";

// =====================================================
// INIT NAV AFTER DOM READY (สำคัญ)
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    // ป้องกันสร้าง nav ซ้ำ
    if(document.querySelector(".create-top-nav")) return;

    const nav = document.createElement("div");
    nav.className = "create-top-nav";

    nav.innerHTML = `
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

    // =====================================================
    // FIX CONTENT OFFSET
    // =====================================================

    requestAnimationFrame(() => {
        const navHeight = nav.offsetHeight;
        document.body.style.paddingTop = navHeight + "px";
    });

});

// =====================================================
// STYLE (LOCAL ISOLATED)
// =====================================================

(function(){

    if(document.getElementById("create-nav-style")) return;

    const style = document.createElement("style");
    style.id = "create-nav-style";

    style.innerHTML = `
    .create-top-nav{
        position:fixed;
        top:0;
        left:0;
        width:100%;
        display:flex;
        justify-content:space-between;
        align-items:center;
        padding:14px 20px;
        background:#000;
        border-bottom:1px solid rgba(255,255,255,0.08);
        z-index:9999;
    }

    .create-nav-left{
        color:#fff;
        font-weight:600;
        letter-spacing:1px;
    }

    .create-nav-right{
        display:flex;
        gap:10px;
    }

    .create-nav-btn{
        background:#00ff88;
        border:none;
        padding:8px 14px;
        font-weight:bold;
        cursor:pointer;
    }

    .create-nav-btn:hover{
        opacity:0.85;
    }
    `;

    document.head.appendChild(style);

})();

// =====================================================
// STRIPE CREDIT TRIGGER (SAFE)
// =====================================================

document.addEventListener("click", async (e) => {

    if(e.target && e.target.id === "btn-credit"){

        try{

            const userId = localStorage.getItem("userId") || "DEV-BYPASS";

            const res = await fetch(API_BASE + "/api/stripe/create-checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    product: "credit_pack_1",
                    userId: userId
                })
            });

            const data = await res.json();

            if(data.url){
                window.location.href = data.url;
            } else {
                alert("Stripe error");
            }

        }catch(err){
            console.error("PAYMENT ERROR:", err);
            alert("Payment Failed");
        }

    }

});
