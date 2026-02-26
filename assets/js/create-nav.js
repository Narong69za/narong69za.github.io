// =====================================================
// SN DESIGN ENGINE NAV
// FINAL LOGIN + PAYMENT CONTROL
// =====================================================

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
// LOGIN STATE (ONLY HERE)
// =====================================================

function getUser(){

    const userId = localStorage.getItem("userId");

    if(!userId){

        console.log("NO LOGIN → redirect");

        window.location.href="/login.html";

        return null;
    }

    return userId;
}


// RUN LOGIN CHECK AUTO

getUser();


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
