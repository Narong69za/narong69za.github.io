// =====================================================
// SN DESIGN ENGINE NAV (CREATE PAGE ONLY)
// ULTRA PAYMENT SYNC FIX
// =====================================================

const API_BASE = "https://sn-design-api.onrender.com";


// =====================================================
// CREATE NAV BAR
// =====================================================

(function(){

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

    requestAnimationFrame(()=>{

        const navHeight = nav.offsetHeight;
        document.body.style.paddingTop = navHeight + "px";

    });

})();


// =====================================================
// STYLE
// =====================================================

const style = document.createElement("style");

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
}

.create-nav-btn{

    background:#00ff88;
    border:none;
    padding:8px 14px;
    font-weight:bold;
    cursor:pointer;

}

`;

document.head.appendChild(style);


// =====================================================
// ULTRA LOGIN CHECK (SYNC)
// =====================================================

function getUser(){

    const userId = localStorage.getItem("userId");

    if(!userId){

        alert("กรุณา Login ก่อน");

        window.location.href="/login.html";

        return null;

    }

    return userId;
}


// =====================================================
// STRIPE CREDIT FLOW (SYNC)
// =====================================================

document.addEventListener("click", async (e)=>{

    if(e.target.id === "btn-credit"){

        try{

            const userId = getUser();

            if(!userId) return;

            const res = await fetch(API_BASE + "/api/stripe/create-checkout",{

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body: JSON.stringify({

                    product:"credit_pack_1",
                    userId:userId

                })

            });

            const data = await res.json();

            if(data.url){

                window.location.href = data.url;

            }else{

                alert("Stripe error");

            }

        }catch(err){

            console.error(err);
            alert("Payment connection error");

        }

    }

});


// =====================================================
// PAYMENT RETURN SYNC
// =====================================================

(function(){

    const params = new URLSearchParams(window.location.search);

    const paymentStatus = params.get("payment");

    if(!paymentStatus) return;

    if(paymentStatus === "success"){

        alert("เติมเครดิตสำเร็จ");

        window.history.replaceState({}, document.title, "/create.html");

        location.reload();

    }

    if(paymentStatus === "cancel"){

        alert("ยกเลิกการชำระเงิน");

        window.history.replaceState({}, document.title, "/create.html");

    }

})();
