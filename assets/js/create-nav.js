/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: create-nav.js
 * VERSION: v2.0.0
 * STATUS: production
 * LAST FIX: replace localStorage login check with cookie-based auth (/auth/me)
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
// AUTH CHECK (COOKIE BASED)
// =====================================================

async function checkAuth(){

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

        // แสดง user email ถ้ามี element
        const emailEl = document.getElementById("userEmail");
        if(emailEl && user.email){
            emailEl.textContent = user.email;
        }

    }catch(err){
        console.error("AUTH CHECK ERROR:",err);
        window.location.replace("/login.html");
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
