/* =====================================================
SN DESIGN PAYMENT CENTER
VERSION: 4.0.0
COOKIE AUTH FINAL
===================================================== */

const API_BASE = "https://sn-design-api.onrender.com";

const paymentBox = document.getElementById("paymentBox");
const statusEl = document.getElementById("paymentStatus");

function setStatus(text){
    if(statusEl){
        statusEl.innerText = "STATUS: " + text;
    }
}

async function checkAuth(){

    try{

        const res = await fetch(`${API_BASE}/auth/me`,{
            credentials:"include",
            cache:"no-store"
        });

        if(res.status !== 200){
            window.location.replace("/login.html");
            return false;
        }

        return true;

    }catch(err){
        window.location.replace("/login.html");
        return false;
    }
}

async function init(){

    const ok = await checkAuth();
    if(!ok) return;

    document.querySelectorAll(".pay-btn").forEach(btn=>{

        btn.addEventListener("click", async ()=>{

            const method = btn.dataset.method;

            setStatus("PROCESSING");
            paymentBox.innerHTML="กำลังดำเนินการ...";

            try{

                let endpoint="";
                let payload={ amount:100 };

                if(method==="stripe"){
                    endpoint="/api/stripe/create-checkout";
                    payload.product="credit_pack_1";
                }

                if(method==="promptpay"){
                    endpoint="/api/thai-payment/promptpay";
                }

                if(method==="truemoney"){
                    endpoint="/api/thai-payment/truemoney";
                }

                if(method==="crypto"){
                    endpoint="/api/crypto
