/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: payment.js
VERSION: v11.1.0
STATUS: production-enterprise
RESPONSIBILITY:
- Enterprise Payment Engine Controller
- Omise / TrueMoney / PromptPay / Crypto / Stripe
- Auth Guard
- Payment Status Polling
- Anti Double Credit Guard
===================================================== */

const paymentBox = document.getElementById("paymentBox");
const statusEl = document.getElementById("paymentStatus");

let CURRENT_METHOD=null;
let TX_LOCK=false;
let POLL_INTERVAL=null;

/* STATUS */

function setStatus(text){
  if(statusEl){
    statusEl.innerText="STATUS: "+text;
  }
}

/* RESET */

function resetUI(){
  if(paymentBox){
    paymentBox.innerHTML="";
  }
}

/* AUTH */

async function checkAuth(){
  try{

    const res = await fetch(`${API_BASE}/auth/me`,{
      credentials:"include"
    });

    if(res.status!==200){
      window.location.replace("/login.html");
      return false;
    }

    return true;

  }catch(err){
    window.location.replace("/login.html");
    return false;
  }
}

/* METHOD */

function setMethod(method){
  CURRENT_METHOD=method;
  resetUI();
  renderMethodUI(method);
}

/* RENDER */

function renderMethodUI(method){

  if(method==="omise"){
    paymentBox.innerHTML=`<button id="confirmBtn">ชำระด้วยบัตร</button>`;
  }

  if(method==="truemoney"){
    paymentBox.innerHTML=`<button id="confirmBtn">ชำระผ่าน TrueMoney Wallet</button>`;
  }

  if(method==="promptpay"){
    paymentBox.innerHTML=`
      <input type="number" id="qrAmount" placeholder="ขั้นต่ำ 50 - สูงสุด 500 บาท">
      <button id="confirmBtn">สร้าง QR PromptPay</button>
      <div id="qrResult"></div>
    `;
  }

  if(method==="crypto"){
    paymentBox.innerHTML=`
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

  if(method==="stripe"){
    paymentBox.innerHTML=`<button id="confirmBtn">Stripe Checkout</button>`;
  }

  const btn=document.getElementById("confirmBtn");

  if(btn){
    btn.addEventListener("click",handleConfirm);
  }

}

/* ROUTER */

async function handleConfirm(){

  if(TX_LOCK){
    setStatus("TRANSACTION LOCKED");
    return;
  }

  TX_LOCK=true;
  setStatus("PROCESSING");

  if(CURRENT_METHOD==="omise") return payOmise();
  if(CURRENT_METHOD==="truemoney") return payTrueMoney();
  if(CURRENT_METHOD==="promptpay") return payPromptPay();
  if(CURRENT_METHOD==="crypto") return payCrypto();
  if(CURRENT_METHOD==="stripe") return payStripe();

}

/* OMISE */

function payOmise(){

  Omise.setPublicKey("pkey_live");

  Omise.createToken("card",{
    name:"SN USER",
    number:"4242424242424242",
    expiration_month:12,
    expiration_year:2030,
    security_code:"123"
  },async function(statusCode,response){

    if(response.object!=="token"){
      setStatus("TOKEN ERROR");
      TX_LOCK=false;
      return;
    }

    const res = await fetch(API_BASE+"/api/omise/create-charge",{
      method:"POST",
      credentials:"include",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        token:response.id,
        product:"credit_pack_1"
      })
    });

    const data = await res.json();

    if(data.success){
      setStatus("SUCCESS");
      paymentBox.innerHTML="เติมเครดิตสำเร็จ";
    }else{
      setStatus("FAILED");
      TX_LOCK=false;
    }

  });

}

/* TRUEMONEY */

async function payTrueMoney(){

  const res = await fetch(API_BASE+"/api/omise/create-truewallet",{
    method:"POST",
    credentials:"include",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      product:"credit_pack_1"
    })
  });

  const data = await res.json();

  if(data.authorizeUri){
    window.location.href=data.authorizeUri;
  }else{
    setStatus("FAILED");
    TX_LOCK=false;
  }

}

/* PROMPTPAY */

async function payPromptPay(){

  const amount=parseInt(document.getElementById("qrAmount").value);

  if(!amount || amount<50 || amount>500){
    setStatus("INVALID AMOUNT");
    TX_LOCK=false;
    return;
  }

  const res = await fetch(API_BASE+"/api/scb/create-qr",{
    method:"POST",
    credentials:"include",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({amount})
  });

  const data = await res.json();

  if(data.qrImage){

    document.getElementById("qrResult").innerHTML=
      `<img src="${data.qrImage}" width="220">`;

    setStatus("WAITING PAYMENT");

    startPolling(data.txId);

  }else{
    setStatus("ERROR");
    TX_LOCK=false;
  }

}

/* CRYPTO */

async function payCrypto(){

  const usd=document.getElementById("usdSelect").value;
  const coin=document.getElementById("coinSelect").value;

  const res = await fetch(API_BASE+"/api/crypto/create-order",{
    method:"POST",
    credentials:"include",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({usd,coin})
  });

  const data = await res.json();

  if(data.paymentUrl){
    window.location.href=data.paymentUrl;
  }else{
    setStatus("ERROR");
    TX_LOCK=false;
  }

}

/* STRIPE */

async function payStripe(){

  const res = await fetch(API_BASE+"/api/stripe/create-checkout",{
    method:"POST",
    credentials:"include",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      product:"credit_pack_1"
    })
  });

  const data = await res.json();

  if(data.url){
    window.location.href=data.url;
  }else{
    setStatus("STRIPE ERROR");
    TX_LOCK=false;
  }

}

/* POLLING */

function startPolling(txId){

  if(POLL_INTERVAL){
    clearInterval(POLL_INTERVAL);
  }

  POLL_INTERVAL=setInterval(async()=>{

    const res = await fetch(API_BASE+"/api/payment/status?tx="+txId,{
      credentials:"include"
    });

    const data = await res.json();

    if(data.status==="success"){

      setStatus("PAYMENT SUCCESS");

      clearInterval(POLL_INTERVAL);
      TX_LOCK=false;

    }

  },5000);

}

/* INIT */

document.addEventListener("DOMContentLoaded",async()=>{

  if(typeof API_BASE==="undefined") return;

  const ok = await checkAuth();
  if(!ok) return;

  document.querySelectorAll("[data-method]").forEach(el=>{
    el.addEventListener("click",()=>{
      const method=el.dataset.method;
      if(method){
        setMethod(method);
      }
    });
  });

});

/* =====================================================
PATCH MODULE
PROJECT: SN DESIGN STUDIO
MODULE: payment.js
VERSION: v11.1.1
STATUS: hotfix-addonly
RESPONSIBILITY:
- PromptPay safety validation
- Transaction guard extension
- Prevent invalid QR creation
NOTE:
ADD-ONLY PATCH
DO NOT MODIFY EXISTING ENGINE
===================================================== */

(function(){

  if(typeof payPromptPay!=="function"){
    return;
  }

  const originalPayPromptPay = payPromptPay;

  payPromptPay = async function(){

    try{

      const amountField = document.getElementById("qrAmount");

      if(!amountField){
        setStatus("QR INPUT ERROR");
        TX_LOCK=false;
        return;
      }

      const value = parseInt(amountField.value);

      if(isNaN(value)){
        setStatus("AMOUNT REQUIRED");
        TX_LOCK=false;
        return;
      }

      if(value<50){
        setStatus("MIN 50 BAHT");
        TX_LOCK=false;
        return;
      }

      if(value>500){
        setStatus("MAX 500 BAHT");
        TX_LOCK=false;
        return;
      }

      return originalPayPromptPay();

    }catch(err){

      console.error("PROMPTPAY PATCH ERROR",err);

      setStatus("PROMPTPAY ERROR");

      TX_LOCK=false;

    }

  };

})();
