/* =====================================================
SN DESIGN PAYMENT CONTROLLER
VERSION: 9.0.0
STATUS: production
LAST FIX:
- fixed handleConfirm router logic
- unified CURRENT_METHOD control
- bind with .engine-card (Enterprise UI)
- stable Omise / TrueMoney / SCB / Crypto flow
- remove duplicated event binding
===================================================== */

const paymentBox = document.getElementById("paymentBox");
const statusEl = document.getElementById("paymentStatus");

let CURRENT_METHOD = null;

/* =============================
   UTIL
============================= */

function setStatus(text){
  if(statusEl){
    statusEl.innerText = "STATUS: " + text;
  }
}

function resetUI(){
  if(paymentBox){
    paymentBox.innerHTML = "";
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

/* =============================
   METHOD SELECT
============================= */

function setMethod(method){
  CURRENT_METHOD = method;
  resetUI();
  renderMethodUI(method);
}

/* =============================
   RENDER UI
============================= */

function renderMethodUI(method){

  if(method === "stripe"){
    paymentBox.innerHTML = `
      <button id="confirmBtn">ชำระด้วยบัตร (Omise)</button>
    `;
  }

  if(method === "truemoney"){
    paymentBox.innerHTML = `
      <button id="confirmBtn">ชำระผ่าน TrueMoney Wallet</button>
    `;
  }

  if(method === "promptpay"){
    paymentBox.innerHTML = `
      <input type="number"
             id="qrAmount"
             placeholder="ขั้นต่ำ 50 - สูงสุด 500 บาท">
      <button id="confirmBtn">สร้าง QR PromptPay</button>
      <div id="qrResult" style="margin-top:15px;"></div>
    `;
  }

  if(method === "crypto"){
    paymentBox.innerHTML = `
      <select id="usdSelect">
        <option value="10">10 USD</option>
        <option value="15">15 USD</option>
        <option value="20">20 USD</option>
        <option value="25">25 USD</option>
        <option value="30">30 USD</option>
        <option value="50">50 USD</option>
      </select>

      <select id="coinSelect">
        <option value="USDT">USDT</option>
        <option value="BNB">BNB</option>
        <option value="TON">TON</option>
      </select>

      <button id="confirmBtn">ชำระด้วย Crypto</button>
    `;
  }

  const btn = document.getElementById("confirmBtn");
  if(btn){
    btn.addEventListener("click", handleConfirm);
  }
}

/* =============================
   CONFIRM ROUTER
============================= */

async function handleConfirm(){

  setStatus("PROCESSING");

  try{

    if(CURRENT_METHOD === "stripe"){
      return payOmise();
    }

    if(CURRENT_METHOD === "truemoney"){
      return payTrueMoney();
    }

    if(CURRENT_METHOD === "promptpay"){
      return payPromptPay();
    }

    if(CURRENT_METHOD === "crypto"){
      return payCrypto();
    }

  }catch(err){
    console.error("PAYMENT ERROR:", err);
    setStatus("ERROR");
  }
}

/* =============================
   OMISE CARD
============================= */

function payOmise(){

  Omise.setPublicKey("pkey_test_66os44r1xiuuit0qvcn");

  Omise.createToken("card", {
    name: "Test User",
    number: "4242424242424242",
    expiration_month: 12,
    expiration_year: 2030,
    security_code: "123"
  }, async function(statusCode, response){

    if(response.object !== "token"){
      setStatus("TOKEN ERROR");
      return;
    }

    const res = await fetch(API_BASE + "/api/omise/create-charge",{
      method:"POST",
      credentials:"include",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        token: response.id,
        product: "credit_pack_1"
      })
    });

    const data = await res.json();

    if(data.success){
      setStatus("SUCCESS");
      paymentBox.innerHTML = "เติมเครดิตสำเร็จ";
    }else{
      setStatus("FAILED");
    }

  });
}

/* =============================
   TRUE MONEY
============================= */

async function payTrueMoney(){

  const res = await fetch(API_BASE + "/api/omise/create-truewallet",{
    method:"POST",
    credentials:"include",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({
      product: "credit_pack_1"
    })
  });

  const data = await res.json();

  if(data.authorizeUri){
    window.location.href = data.authorizeUri;
  }else{
    console.log(data);
    setStatus("FAILED");
  }
}

/* =============================
   PROMPTPAY (SCB)
============================= */

async function payPromptPay(){

  const amount = parseInt(document.getElementById("qrAmount").value);

  if(!amount || amount < 50 || amount > 500){
    alert("ขั้นต่ำ 50 บาท สูงสุด 500 บาท");
    setStatus("INVALID AMOUNT");
    return;
  }

  const res = await fetch(API_BASE + "/api/scb/create-qr",{
    method:"POST",
    credentials:"include",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ amount })
  });

  const data = await res.json();

  if(data.qrImage){
    document.getElementById("qrResult").innerHTML =
      `<img src="${data.qrImage}" width="220">`;
    setStatus("WAITING PAYMENT");
  }else{
    setStatus("ERROR");
  }
}

/* =============================
   CRYPTO (BINANCE)
============================= */

async function payCrypto(){

  const usd = document.getElementById("usdSelect").value;
  const coin = document.getElementById("coinSelect").value;

  const res = await fetch(API_BASE + "/api/crypto/create-order",{
    method:"POST",
    credentials:"include",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ usd, coin })
  });

  const data = await res.json();

  if(data.paymentUrl){
    window.location.href = data.paymentUrl;
  }else{
    setStatus("ERROR");
  }
}

/* =============================
   INIT
============================= */

document.addEventListener("DOMContentLoaded", async ()=>{

  if(typeof API_BASE === "undefined") return;

  const ok = await checkAuth();
  if(!ok) return;

  document.querySelectorAll(".engine-btn").forEach(btn=>{
    btn.addEventListener("click",(e)=>{
      e.stopPropagation();
      const card = btn.closest(".engine-card");
      if(card){
        setMethod(card.dataset.method);
      }
    });
  });

});
