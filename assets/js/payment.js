/* =====================================================
SN DESIGN PAYMENT CENTER
VERSION: 5.2.0
LAST FIX: add TrueMoney Wallet flow (add-only)
===================================================== */

const paymentBox = document.getElementById("paymentBox");
const statusEl = document.getElementById("paymentStatus");

let CURRENT_USER_ID = null;

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

        const user = await res.json();

        if(user && user.id){
            CURRENT_USER_ID = user.id;
        }

        return true;

    }catch(err){
        window.location.replace("/login.html");
        return false;
    }
}

async function init(){

    if (typeof API_BASE === "undefined") return;

    const ok = await checkAuth();
    if(!ok) return;

    document.querySelectorAll(".pay-btn").forEach(btn=>{

        btn.addEventListener("click", async ()=>{

            const method = btn.dataset.method;

            setStatus("PROCESSING");
            paymentBox.innerHTML="กำลังดำเนินการ...";

            try{

                // =============================
                // CARD
                // =============================
                if(method==="stripe"){

                    if(!CURRENT_USER_ID) return;

                    Omise.setPublicKey("pkey_test_xxxxxxxxx");

                    Omise.createToken("card", {
                        name: "Test User",
                        number: "4242424242424242",
                        expiration_month: 12,
                        expiration_year: 2030,
                        security_code: "123"
                    }, async function(statusCode, response){

                        if(response.object !== "token") return;

                        const res = await fetch(API_BASE + "/api/omise/create-charge",{
                            method:"POST",
                            credentials:"include",
                            headers:{
                                "Content-Type":"application/json",
                                "x-user-id": CURRENT_USER_ID
                            },
                            body:JSON.stringify({
                                token: response.id,
                                product:"credit_pack_1"
                            })
                        });

                        const data = await res.json();

                        if(data.success){
                            setStatus("SUCCESS");
                            paymentBox.innerHTML="ชำระเงินสำเร็จ เติมเครดิตแล้ว";
                        }

                    });

                    return;
                }

                // =============================
                // TRUE MONEY WALLET
                // =============================
                if(method==="truemoney"){

                    if(!CURRENT_USER_ID) return;

                    const res = await fetch(API_BASE + "/api/omise/create-truewallet",{
                        method:"POST",
                        credentials:"include",
                        headers:{
                            "Content-Type":"application/json",
                            "x-user-id": CURRENT_USER_ID
                        },
                        body:JSON.stringify({
                            product:"credit_pack_1"
                        })
                    });

                    const data = await res.json();

                    if(data.authorizeUri){
                        window.location.href = data.authorizeUri;
                    }

                    return;
                }

                paymentBox.innerHTML="ช่องทางนี้ยังไม่เปิดใช้งาน";
                setStatus("NOT AVAILABLE");

            }catch(err){

                console.error(err);
                setStatus("ERROR");
            }

        });

    });

}

document.addEventListener("DOMContentLoaded", init);
