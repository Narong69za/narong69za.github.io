/* =====================================================
SN DESIGN PAYMENT CENTER
VERSION: 4.5.0
LAST FIX:
- add omise create-charge support
- send packageName + userId for metadata
- keep original structure intact (add-only)
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

                // =====================================================
                // STRIPE (ORIGINAL - UNTOUCHED)
                // =====================================================

                if(method==="stripe"){
                    endpoint="/api/stripe/create-checkout";
                    payload = {
                        product:"credit_pack_1"
                    };
                }

                // =====================================================
                // 🔥 OMISE (ADD-ONLY)
                // =====================================================

                if(method==="truemoney"){

                    endpoint="/api/omise/create-charge";

                    const packageName =
                        document.getElementById("packageName")?.value || "starter-100";

                    // userId ดึงจาก cookie-based auth
                    const me = await fetch(`${API_BASE}/auth/me`,{
                        credentials:"include"
                    });

                    const user = await me.json();

                    payload = {
                        amount: 10000, // 100 บาทตัวอย่าง (แก้ตามแพ็กเกจได้)
                        token: "tokn_test_4242424242424242", // TEST MODE ONLY
                        packageName: packageName,
                        userId: user.id
                    };

                }

                // =====================================================

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

                if(method==="truemoney"){
                    paymentBox.innerHTML="สร้างรายการชำระเงินสำเร็จ (Test Mode)";
                    setStatus("CHARGE CREATED");
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
