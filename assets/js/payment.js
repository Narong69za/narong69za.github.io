/* =====================================================
SN DESIGN PAYMENT CENTER
VERSION: 4.4.0
LAST FIX: remove duplicate auth fetch before stripe call
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
        console.error("API_BASE not found.");
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
                let payload={};

                if(method==="stripe"){
                    endpoint="/api/stripe/create-checkout";
                    payload = {
                        product:"credit_pack_1",
                        userId: 1 // ชั่วคราวเพื่อทดสอบ flow
                    };
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
                    throw new Error("Payment API failed");
                }

                const data = await res.json();

                if(method==="stripe" && data.url){
                    window.location.href=data.url;
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
