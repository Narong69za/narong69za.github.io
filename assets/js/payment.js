/* =====================================================
MODULE: payment.js (v11.1.2 - FULL PRODUCTION REPLICA)
===================================================== */
const API_BASE = "https://api.sn-designstudio.dev";
const FRONTEND_BASE = "https://sn-designstudio.dev";

const paymentBox = document.getElementById("paymentBox");
const statusEl = document.getElementById("paymentStatus");
let CURRENT_METHOD=null, TX_LOCK=false, POLL_INTERVAL=null;

function setStatus(text){ if(statusEl) statusEl.innerText="STATUS: "+text; }
function resetUI(){ if(paymentBox) paymentBox.innerHTML=""; }

/* AUTH - [FIXED FOR COOKIE] */
async function checkAuth(){
  try{
    const res = await fetch(`${API_BASE}/auth/me`,{
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    });
    if(res.status!==200){ window.location.replace(`${FRONTEND_BASE}/login.html`); return false; }
    return true;
  }catch(err){ window.location.replace(`${FRONTEND_BASE}/login.html`); return false; }
}

function setMethod(method){ CURRENT_METHOD=method; resetUI(); renderMethodUI(method); }

function renderMethodUI(method){
  if(method==="omise"){ paymentBox.innerHTML=`<button id="confirmBtn" class="engine-btn" style="background:gold; color:black;">ชำระด้วยบัตร</button>`; }
  if(method==="truemoney"){ paymentBox.innerHTML=`<button id="confirmBtn" class="engine-btn" style="background:#ff7a00; color:white;">ชำระผ่าน TrueMoney Wallet</button>`; }
  if(method==="promptpay"){ paymentBox.innerHTML=`<input type="number" id="qrAmount" placeholder="ขั้นต่ำ 50 - สูงสุด 500 บาท"><button id="confirmBtn" class="engine-btn" style="background:#6a1b9a; color:white;">สร้าง QR PromptPay</button><div id="qrResult"></div>`; }
  if(method==="crypto"){ paymentBox.innerHTML=`<select id="usdSelect"><option value="10">10 USD</option><option value="50">50 USD</option></select><select id="coinSelect"><option value="USDT">USDT</option><option value="TON">TON</option></select><button id="confirmBtn" class="engine-btn" style="background:#ffd600; color:black;">ชำระด้วย Crypto</button>`; }
  if(method==="stripe"){ paymentBox.innerHTML=`<button id="confirmBtn" class="engine-btn" style="background:#635bff; color:white;">Stripe Checkout</button>`; }
  const btn=document.getElementById("confirmBtn");
  if(btn) btn.addEventListener("click",handleConfirm);
}

async function handleConfirm(){
  if(TX_LOCK) return setStatus("TRANSACTION LOCKED");
  TX_LOCK=true; setStatus("PROCESSING");
  if(CURRENT_METHOD==="promptpay") return payPromptPay();
  if(CURRENT_METHOD==="truemoney") return payTrueMoney();
  if(CURRENT_METHOD==="stripe") return payStripe();
  if(CURRENT_METHOD==="crypto") return payCrypto();
}

/* METHODS - [FIXED FETCH HEADERS] */
async function payTrueMoney(){
  const res = await fetch(API_BASE+"/api/omise/create-truewallet",{
    method:"POST", credentials: "include", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ product:"credit_pack_1" })
  });
  const data = await res.json();
  if(data.authorizeUri) window.location.href=data.authorizeUri;
  else { setStatus("FAILED"); TX_LOCK=false; }
}

async function payPromptPay(){
  const amount=parseInt(document.getElementById("qrAmount").value);
  if(!amount || amount<50 || amount>500){ setStatus("INVALID AMOUNT"); TX_LOCK=false; return; }
  const res = await fetch(API_BASE+"/api/scb/create-qr",{
    method:"POST", credentials: "include", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({amount})
  });
  const data = await res.json();
  if(data.qrImage){
    const qrFrame = document.getElementById("qrFrame"), qrModal = document.getElementById("qrModal"), displayAmount = document.getElementById("displayAmount");
    if(qrFrame && qrModal){
      qrFrame.innerHTML = `<img src="${data.qrImage}" width="250" style="display:block;">`;
      displayAmount.innerText = amount;
      qrModal.style.display = "flex";
    }
    setStatus("WAITING PAYMENT"); startPolling(data.txId);
  }else{ setStatus("ERROR"); TX_LOCK=false; }
}

async function payCrypto(){
  const usd=document.getElementById("usdSelect").value, coin=document.getElementById("coinSelect").value;
  const res = await fetch(API_BASE+"/api/crypto/create-order",{
    method:"POST", credentials: "include", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({usd,coin})
  });
  const data = await res.json();
  if(data.paymentUrl) window.location.href=data.paymentUrl;
  else { setStatus("ERROR"); TX_LOCK=false; }
}

async function payStripe(){
  const res = await fetch(API_BASE+"/api/stripe/create-checkout",{
    method:"POST", credentials: "include", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ product:"credit_pack_1" })
  });
  const data = await res.json();
  if(data.url) window.location.href=data.url;
  else { setStatus("STRIPE ERROR"); TX_LOCK=false; }
}

function startPolling(txId){
  if(POLL_INTERVAL) clearInterval(POLL_INTERVAL);
  POLL_INTERVAL=setInterval(async()=>{
    const res = await fetch(API_BASE+"/api/payment/status?tx="+txId,{ credentials: "include" });
    const data = await res.json();
    if(data.status==="success"){
      setStatus("PAYMENT SUCCESS");
      const qrModal = document.getElementById("qrModal");
      if(qrModal) qrModal.style.display = "none";
      clearInterval(POLL_INTERVAL); TX_LOCK=false;
      alert("ชำระเงินสำเร็จ!"); window.location.reload();
    }
  },5000);
}

/* INITIALIZE */
document.addEventListener("DOMContentLoaded",async()=>{
  if(await checkAuth()){
    document.querySelectorAll("[data-method]").forEach(el=>{
      el.addEventListener("click",()=>{ setMethod(el.dataset.method); });
    });
    const closeBtn = document.getElementById("closeQr"), qrModal = document.getElementById("qrModal");
    if(closeBtn && qrModal){
      closeBtn.onclick = () => { qrModal.style.display = "none"; TX_LOCK = false; setStatus("IDLE"); if(POLL_INTERVAL) clearInterval(POLL_INTERVAL); };
    }
  }
});

/* PATCH MODULE (PROMPTPAY SAFETY) - [ORIGINAL UNTOUCHED] */
(function(){
  if(typeof payPromptPay!=="function") return;
  const originalPayPromptPay = payPromptPay;
  payPromptPay = async function(){
    try{
      const amountField = document.getElementById("qrAmount");
      if(!amountField){ setStatus("QR INPUT ERROR"); TX_LOCK=false; return; }
      const value = parseInt(amountField.value);
      if(isNaN(value) || value<50 || value>500){ setStatus("MIN 50 - MAX 500"); TX_LOCK=false; return; }
      return originalPayPromptPay();
    }catch(err){ setStatus("PROMPTPAY ERROR"); TX_LOCK=false; }
  };
})();

