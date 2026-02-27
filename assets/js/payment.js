/* =====================================================
SN DESIGN PAYMENT CENTER
FILE: payment.js
VERSION: 2.0.0
STATUS: FINAL LOCK (JWT AUTH UNIFIED)
LAST UPDATE: AUTH SYSTEM CLEANED
NOTE: ใช้ JWT TOKEN เท่านั้น ห้ามใช้ userId อีกต่อไป
===================================================== */

const API_BASE = "https://sn-design-api.onrender.com";

const paymentBox = document.getElementById("paymentBox");
const statusEl = document.getElementById("paymentStatus");

/* =====================================================
JWT AUTH CHECK (FINAL)
===================================================== */

function getToken(){

    const token = localStorage.getItem("token");

    if(!token){

        alert("กรุณา Login ก่อน");

        window.location.href="/login.html";

        return null;
    }

    return token;
}

function setStatus(text){

    if(statusEl){
        statusEl.innerText = "STATUS: " + text;
    }
}

/* =====================================================
PAYMENT HANDLER (JWT MODE)
===================================================== */

document.querySelectorAll(".pay-btn").forEach(btn=>{

    btn.addEventListener("click", async ()=>{

        const method = btn.dataset.method;
        const token = getToken();

        if(!token) return;

        setStatus("PROCESSING");

        if(paymentBox){
            paymentBox.innerHTML="กำลังดำเนินการ...";
        }

        try{

            let endpoint = "";
            let payload = {
                amount:100
            };

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
                    "Content-Type":"application/json",
                    "Authorization": "Bearer " + token
                },
                body:JSON.stringify(payload)
            });

            const data = await res.json();

            console.log("PAYMENT RESPONSE:",data);

            /* ================= STRIPE ================= */

            if(method==="stripe" && data.url){
                window.location.href=data.url;
                return;
            }

            /* ================= PROMPTPAY ================= */

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

            /* ================= TRUEMONEY ================= */

            if(method==="truemoney" && data.redirectUrl){
                window.location.href=data.redirectUrl;
                return;
            }

            /* ================= CRYPTO ================= */

            if(method==="crypto" && data.redirectUrl){
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
