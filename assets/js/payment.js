/* =====================================================
SN DESIGN PAYMENT CENTER
VERSION: 4.2.0
COOKIE AUTH FINAL (API_BASE FROM config.js)
LAST FIX: send userId to stripe + strict res.ok check
===================================================== */

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

    if (typeof API_BASE === "undefined") {
        console.error("API_BASE not found. Ensure config.js is loaded first.");
        return;
    }

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

                    // 🔥 ดึง userId จาก auth/me
                    const meRes = await fetch(`${API_BASE}/auth/me`,{
                        credentials:"include",
                        cache:"no-store"
                    });

                    if(!meRes.ok){
                        throw new Error("AUTH FAILED");
                    }

                    const me = await meRes.json();

                    payload = {
                        product:"credit_pack_1",
                        userId: me.id
                    };
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

                if(!res.ok){
                    console.error("Stripe API failed:",res.status);
                    throw new Error("Payment API error");
                }

                const data = await res.json();

                console.log("PAYMENT RESPONSE:",data);

                if(method==="stripe" && data.url){
                    window.location.href=data.url;
                    return;
                }

                if(method==="promptpay" && data.qr){

                    paymentBox.innerHTML=`
                        <h3>สแกน QR เพื่อชำระเงิน</h3>
                        <img src="${data.qr}" style="max-width:260px;margin-top:15px;" />
                    `;

                    setStatus("WAITING PAYMENT");
                    return;
                }

                if(method==="truemoney" && data.redirectUrl){
                    window.location.href=data.redirectUrl;
                    return;
                }

                if(method==="crypto" && data.redirectUrl){
                    window.location.href=data.redirectUrl;
                    return;
                }

                throw new Error("Invalid payment response");

            }catch(err){

                console.error("PAYMENT ERROR:",err);
                paymentBox.innerHTML="เกิดข้อผิดพลาด";
                setStatus("ERROR");
            }

        });

    });

}

document.addEventListener("DOMContentLoaded", init);
