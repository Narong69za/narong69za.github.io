/* =====================================================
SN DESIGN PAYMENT CENTER
FILE: payment.js
VERSION: 3.0.0
STATUS: FINAL - COOKIE BASED AUTH
===================================================== */

const API_BASE = "https://sn-design-api.onrender.com";

const paymentBox = document.getElementById("paymentBox");
const statusEl = document.getElementById("paymentStatus");

/* =====================================================
AUTH CHECK (COOKIE BASED)
===================================================== */

async function checkAuth(){

    try{

        const res = await fetch(`${API_BASE}/auth/me`,{
            credentials:"include",
            cache:"no-store"
        });

        if(res.status !== 200){
            window.location.replace("/login.html");
            return null;
        }

        return await res.json();

    }catch(err){

        console.error("AUTH ERROR:",err);
        window.location.replace("/login.html");
        return null;
    }
}

function setStatus(text){

    if(statusEl){
        statusEl.innerText = "STATUS: " + text;
    }
}

/* =====================================================
PAYMENT HANDLER
===================================================== */

async function initPayment(){

    const user = await checkAuth();
    if(!user) return;

    document.querySelectorAll(".pay-btn").forEach(btn=>{

        btn.addEventListener("click", async ()=>{

            const method = btn.dataset.method;

            setStatus("PROCESSING");

            if(paymentBox){
                paymentBox.innerHTML="กำลังดำเนินการ...";
            }

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
                    endpoint="/api/crypto-payment/create";
                }

                const res = await fetch(API_BASE + endpoint,{
                    method:"POST",
                    credentials:"include",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(payload)
                });

                const data = await res.json();

                console.log("PAYMENT RESPONSE:",data);

                /* STRIPE */
                if(method==="stripe" && data.url){
                    window.location.href=data.url;
                    return;
                }

                /* PROMPTPAY */
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

                /* TRUEMONEY / CRYPTO */
                if(data.redirectUrl){
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

}

initPayment();
