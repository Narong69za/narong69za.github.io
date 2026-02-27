/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: create-nav.js
 * VERSION: v2.1.0
 * STATUS: production
 * LAST FIX: prevent auth race condition + retry logic before redirect
 */

const API_BASE = "https://sn-design-api.onrender.com";

// =====================================================
// NAV BUILD
// =====================================================

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


// =====================================================
// AUTH CHECK (SAFE VERSION)
// =====================================================

async function checkAuth(retry = true){

    try{

        const res = await fetch(`${API_BASE}/auth/me`,{
            credentials:"include",
            cache:"no-store"
        });

        if(res.status === 200){

            const user = await res.json();

            const emailEl = document.getElementById("userEmail");
            if(emailEl && user.email){
                emailEl.textContent = user.email;
            }

            return;
        }

        // ถ้า 401 และยังไม่ได้ retry → รอ 300ms แล้วลองใหม่
        if(res.status === 401 && retry){
            setTimeout(()=> checkAuth(false), 300);
            return;
        }

        // 401 รอบสอง → ค่อย redirect
        if(res.status === 401){
            window.location.replace("/login.html");
        }

    }catch(err){
        console.error("AUTH CHECK NETWORK ERROR:",err);
        // ไม่ redirect ทันทีถ้า network issue
    }
}

// RUN AUTH CHECK
checkAuth();


// =====================================================
// CREDIT NAVIGATION
// =====================================================

document.addEventListener("click",(e)=>{

    if(e.target.id==="btn-credit"){
        window.location.href="/payment.html";
    }

});


// =====================================================
// PAYMENT RETURN SYNC
// =====================================================

(function(){

    const params=new URLSearchParams(window.location.search);
    const payment=params.get("payment");

    if(!payment) return;

    if(payment==="success"){
        alert("เติมเครดิตสำเร็จ");
        history.replaceState({},document.title,"/create.html");
    }

    if(payment==="cancel"){
        alert("ยกเลิกการชำระเงิน");
        history.replaceState({},document.title,"/create.html");
    }

})();
