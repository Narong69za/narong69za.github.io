/* =====================================================
SN DESIGN PAYMENT CENTER
VERSION: 6.1.0
LAST FIX: remove execution collision, unify crypto + omise flow
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
        if(user?.id){
            CURRENT_USER_ID = user.id;
        }

        return true;

    }catch{
        window.location.replace("/login.html");
        return false;
    }
}

function renderCryptoUI(){

    paymentBox.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:20px;">
            <h3 style="color:#00ffc8;">⚡ Binance Pay</h3>
            <div id="usdGrid"></div>
            <div id="coinGrid"></div>
            <button id="confirmCryptoBtn">🚀 ยืนยันชำระ</button>
        </div>
    `;

    const usdGrid = document.getElementById("usdGrid");
    const coinGrid = document.getElementById("coinGrid");

    const usdList = [10,15,20,25,30,50];
    const coinList = ["USDT","BNB","TON"];

    let selectedUSD = null;
    let selectedCoin = null;

    usdGrid.innerHTML = usdList.map(v=>
        `<button class="crypto-btn" data-usd="${v}">${v} USD</button>`
    ).join("");

    coinGrid.innerHTML = coinList.map(c=>
        `<button class="crypto-btn" data-coin="${c}">${c}</button>`
    ).join("");

    usdGrid.querySelectorAll("button").forEach(btn=>{
        btn.onclick=()=>{
            selectedUSD = btn.dataset.usd;
        };
    });

    coinGrid.querySelectorAll("button").forEach(btn=>{
        btn.onclick=()=>{
            selectedCoin = btn.dataset.coin;
        };
    });

    document.getElementById("confirmCryptoBtn").onclick = async ()=>{

        if(!selectedUSD || !selectedCoin){
            alert("เลือกจำนวนเงินและเหรียญก่อน");
            return;
        }

        setStatus("PROCESSING");

        const res = await fetch(API_BASE + "/api/crypto/create-order",{
            method:"POST",
            credentials:"include",
            headers:{
                "Content-Type":"application/json",
                "x-user-id": CURRENT_USER_ID
            },
            body:JSON.stringify({
                usd:selectedUSD,
                coin:selectedCoin
            })
        });

        const data = await res.json();

        if(data.paymentUrl){
            window.location.href = data.paymentUrl;
        }else{
            setStatus("ERROR");
        }

    };

    setStatus("CRYPTO READY");
}

async function init(){

    if (typeof API_BASE === "undefined") return;

    const ok = await checkAuth();
    if(!ok) return;

    document.querySelectorAll(".pay-btn").forEach(btn=>{

        btn.addEventListener("click", async ()=>{

            const method = btn.dataset.method;

            setStatus("PROCESSING");

            try{

                if(method==="crypto"){
                    renderCryptoUI();
                    return;
                }

                if(method==="stripe"){

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
                                token: response.id
                            })
                        });

                        const data = await res.json();

                        if(data.success){
                            setStatus("SUCCESS");
                            paymentBox.innerHTML="เติมเครดิตสำเร็จ";
                        }

                    });

                    return;
                }

                if(method==="truemoney"){

                    const res = await fetch(API_BASE + "/api/omise/create-truewallet",{
                        method:"POST",
                        credentials:"include",
                        headers:{
                            "Content-Type":"application/json",
                            "x-user-id": CURRENT_USER_ID
                        }
                    });

                    const data = await res.json();

                    if(data.authorizeUri){
                        window.location.href = data.authorizeUri;
                    }

                    return;
                }

                setStatus("NOT AVAILABLE");

            }catch(err){
                console.error(err);
                setStatus("ERROR");
            }

        });

    });

}

document.addEventListener("DOMContentLoaded", init);
