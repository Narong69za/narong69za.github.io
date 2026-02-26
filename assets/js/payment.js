/* =====================================================
SN DESIGN PAYMENT CENTER
CONTROL FILE: payment.js
DO NOT TOUCH LAYOUT
===================================================== */

const API_BASE = "https://sn-design-api.onrender.com";

const paymentBox = document.getElementById("paymentBox");
const statusEl = document.getElementById("paymentStatus");

function getUserId(){

    const userId = localStorage.getItem("userId");

    if(!userId){
        alert("กรุณา Login ก่อน");
        window.location.href = "/login.html";
        return null;
    }

    return userId;
}

function setStatus(text){
    statusEl.innerText = "STATUS: " + text;
}

/* =====================================================
HANDLE BUTTON CLICK
===================================================== */

document.querySelectorAll(".pay-btn").forEach(btn => {

    btn.addEventListener("click", async () => {

        const method = btn.dataset.method;
        const userId = getUserId();

        if(!userId) return;

        setStatus("PROCESSING");

        paymentBox.innerHTML = "กำลังดำเนินการ...";

        try{

            if(method === "stripe"){

                const res = await fetch(API_BASE + "/api/stripe/create-checkout",{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        product:"credit_pack_1",
                        userId:userId
                    })
                });

                const data = await res.json();

                if(data.url){
                    window.location.href = data.url;
                }else{
                    throw new Error("Stripe Error");
                }

            }

            if(method === "promptpay"){

                const res = await fetch(API_BASE + "/api/thai-payment/promptpay",{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        amount:100,
                        userId:userId
                    })
                });

                const data = await res.json();

                if(data.qr){

                    paymentBox.innerHTML = `
                        <h3>สแกน QR เพื่อชำระเงิน</h3>
                        <img src="${data.qr}" style="max-width:250px;margin-top:15px;" />
                    `;

                    setStatus("WAITING PAYMENT");

                }else{
                    throw new Error("QR Error");
                }

            }

            if(method === "truemoney"){

                const res = await fetch(API_BASE + "/api/thai-payment/truemoney",{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        amount:100,
                        userId:userId
                    })
                });

                const data = await res.json();

                if(data.redirectUrl){
                    window.location.href = data.redirectUrl;
                }else{
                    throw new Error("TrueMoney Error");
                }

            }

            if(method === "crypto"){

                const res = await fetch(API_BASE + "/api/crypto-payment/create",{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        amount:100,
                        userId:userId
                    })
                });

                const data = await res.json();

                if(data.redirectUrl){
                    window.location.href = data.redirectUrl;
                }else{
                    throw new Error("Crypto Error");
                }

            }

        }catch(err){

            console.error(err);
            paymentBox.innerHTML = "เกิดข้อผิดพลาด";
            setStatus("ERROR");

        }

    });

});
