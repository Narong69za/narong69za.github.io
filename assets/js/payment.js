/* =====================================================
SN DESIGN PAYMENT CENTER
VERSION: 5.0.0
LAST FIX: implement real Omise token flow (card)
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

                // =============================
                // 💳 OMISE CARD FLOW (REAL)
                // =============================
                if(method==="stripe"){

                    if(typeof Omise === "undefined"){
                        setStatus("OMISE JS NOT LOADED");
                        paymentBox.innerHTML="Omise.js โหลดไม่สำเร็จ";
                        return;
                    }

                    Omise.setPublicKey("pkey_test_66os44r1xiuuit0qvcn"); // 🔥 ใส่ของจริง

                    Omise.createToken("card", {
                        name: "Test User",
                        number: "4242424242424242",
                        expiration_month: 12,
                        expiration_year: 2030,
                        security_code: "123"
                    }, async function(statusCode, response){

                        if(response.object !== "token"){
                            setStatus("TOKEN ERROR");
                            paymentBox.innerHTML="สร้าง Token ไม่สำเร็จ";
                            return;
                        }

                        try{

                            const res = await fetch(API_BASE + "/api/omise/create-charge",{
                                method:"POST",
                                headers:{
                                    "Content-Type":"application/json"
                                },
                                credentials:"include",
                                body:JSON.stringify({
                                    token: response.id,
                                    product:"credit_pack_1"
                                })
                            });

                            if(!res.ok){
                                throw new Error("Charge API Failed");
                            }

                            const data = await res.json();

                            if(data.success){
                                setStatus("SUCCESS");
                                paymentBox.innerHTML="ชำระเงินสำเร็จ เติมเครดิตแล้ว";
                            }else{
                                setStatus("FAILED");
                                paymentBox.innerHTML="ชำระเงินไม่สำเร็จ";
                            }

                        }catch(err){
                            console.error("CHARGE ERROR:",err);
                            setStatus("ERROR");
                            paymentBox.innerHTML="เกิดข้อผิดพลาดในการเรียก Charge";
                        }

                    });

                    return;
                }

                // =============================
                // OTHER METHODS (PLACEHOLDER)
                // =============================

                paymentBox.innerHTML="ช่องทางนี้ยังไม่เปิดใช้งาน";
                setStatus("NOT AVAILABLE");

            }catch(err){

                console.error("PAYMENT ERROR:",err);
                paymentBox.innerHTML="เกิดข้อผิดพลาด";
                setStatus("ERROR");
            }

        });

    });

}

document.addEventListener("DOMContentLoaded", init);
