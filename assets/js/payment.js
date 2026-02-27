/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: payment.js
 * VERSION: v3.0.0
 * STATUS: production
 * LAST FIX: migrate from localStorage JWT to cookie-based auth
 */

const API_BASE = "https://sn-design-api.onrender.com";

const paymentBox = document.getElementById("paymentBox");
const statusEl = document.getElementById("paymentStatus");

/* =====================================================
AUTH CHECK (COOKIE MODE)
===================================================== */

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
        console.error("AUTH CHECK ERROR:",err);
        return false;
    }
}

function setStatus(text){
    if(statusEl){
        statusEl.innerText = "STATUS: " + text;
    }
}

/* =====================================================
PAYMENT HANDLER (COOKIE MODE)
===================================================== */

document.querySelectorAll(".pay-btn").forEach(btn=>{

    btn.addEventListener("click", async ()=>{

        const method = btn.dataset.method;

        const authOk = await checkAuth();
        if(!authOk) return;

        setStatus("PROCESSING");

        if(paymentBox){
            paymentBox.innerHTML="กำลังดำเนินการ...";
        }

        try{

            let endpoint = "";
            let payload = { amount:100 };

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
                endpoint="/api/crypto-payment/create";
            }

            const res = await fetch(API_BASE + endpoint,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:"include",
                body:JSON.stringify(payload)
            });

            const data = await res.json();

            console.log("PAYMENT RESPONSE:",data);

            if(method==="stripe" && data.url){
                window.location.href=data.url;
                return;
            }

            if(method==="promptpay" && data.qr){

                if(paymentBox){
                    paymentBox.innerHTML=`
                        <h3>สแกน QR เพื่อชำระเงิน</h3>
                        <img src="${data.qr}" style="max-width:260px;margin-top:15px;" />
                    `;
                }

                setStatus("WAITING PAYMENT");
                return;
            }

            if((method==="truemoney" || method==="crypto") && data.redirectUrl){
                window.location.href=data.redirectUrl;
                return;
            }

            throw new Error("Invalid payment response");

        }catch(err){

            console.error("PAYMENT ERROR:",err);

            if(paymentBox){
                paymentBox.innerHTML="เกิดข้อผิดพลาด";
            }

            setStatus("ERROR");
        }

    });

});
