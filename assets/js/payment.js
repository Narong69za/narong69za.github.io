/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: payment.js
VERSION: v11.1.2 (Security & Domain Fixed)
STATUS: production-enterprise
RESPONSIBILITY:
- Enterprise Payment Engine Controller
- Omise / TrueMoney / PromptPay / Crypto / Stripe
- Auth Guard (Bearer Token Fixed)
- Payment Status Polling
- Anti Double Credit Guard
- Premium SCB Pop-up Controller
===================================================== */

const API_BASE = window.CONFIG ? window.CONFIG.API_BASE_URL : "https://api.sn-designstudio.dev";
const FRONTEND_BASE = "https://sn-designstudio.dev"; // ระบุโดเมนหน้าบ้านให้ชัดเจน

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

/* AUTH - แก้ไขให้ใช้ Bearer Token เหมือนหน้าอื่น */

async function checkAuth(){
  const token = localStorage.getItem("token");
  if(!token){
    window.location.replace(`${FRONTEND_BASE}/login.html`);
    return false;
  }

  try{
    const res = await fetch(`${API_BASE}/auth/me`,{
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if(res.status!==200){
      window.location.replace(`${FRONTEND_BASE}/login.html`);
      return false;
    }

    return true;

  }catch(err){
    window.location.replace(`${FRONTEND_BASE}/login.html`);
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
    paymentBox.innerHTML=`<button id="confirmBtn" class="engine-btn" style="background:gold; color:black;">ชำระด้วยบัตร</button>`;
  }

  if(method==="truemoney"){
    paymentBox.innerHTML=`<button id="confirmBtn" class="engine-btn" style="background:#ff7a00; color:white;">ชำระผ่าน TrueMoney Wallet</button>`;
  }

  if(method==="promptpay"){
    paymentBox.innerHTML=`
      <input type="number" id="qrAmount" placeholder="ขั้นต่ำ 50 - สูงสุด 500 บาท">
      <button id="confirmBtn" class="engine-btn" style="background:#6a1b9a; color:white;">สร้าง QR PromptPay</button>
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

      <button id="confirmBtn" class="engine-btn" style="background:#ffd600; color:black;">ชำระด้วย Crypto</button>
    `;
  }

  if(method==="stripe"){
    paymentBox.innerHTML=`<button id="confirmBtn" class="engine-btn" style="background:#635bff; color:white;">Stripe Checkout</button>`;
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

/* OMISE - แก้ไข Headers */

function payOmise(){
  const tokenLocal = localStorage.getItem("token");
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
      headers:{
        "Content-Type":"application/json",
        "Authorization": `Bearer ${tokenLocal}`
      },
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

/* TRUEMONEY - แก้ไข Headers */

async function payTrueMoney(){
  const tokenLocal = localStorage.getItem("token");
  const res = await fetch(API_BASE+"/api/omise/create-truewallet",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization": `Bearer ${tokenLocal}`
    },
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

/* PROMPTPAY - [MODIFIED] To support Premium Pop-up */

async function payPromptPay(){
  const tokenLocal = localStorage.getItem("token");
  const amountField = document.getElementById("qrAmount");
  const amount=parseInt(amountField.value);

  if(!amount || amount<50 || amount>500){
    setStatus("INVALID AMOUNT");
    TX_LOCK=false;
    return;
  }

  const res = await fetch(API_BASE+"/api/scb/create-qr",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization": `Bearer ${tokenLocal}`
    },
    body:JSON.stringify({amount})
  });

  const data = await res.json();

  if(data.qrImage){
    // [MODIFIED] Render into Pop-up Modal instead of paymentBox
    const qrFrame = document.getElementById("qrFrame");
    const qrModal = document.getElementById("qrModal");
    const displayAmount = document.getElementById("displayAmount");

    if(qrFrame && qrModal){
      qrFrame.innerHTML = `<img src="${data.qrImage}" width="250" style="display:block;">`;
      displayAmount.innerText = amount;
      qrModal.style.display = "flex";
    }

    setStatus("WAITING PAYMENT");
    startPolling(data.txId);

  }else{
    setStatus("ERROR");
    TX_LOCK=false;
  }

}

/* CRYPTO - แก้ไข Headers */

async function payCrypto(){
  const tokenLocal = localStorage.getItem("token");
  const usd=document.getElementById("usdSelect").value;
  const coin=document.getElementById("coinSelect").value;

  const res = await fetch(API_BASE+"/api/crypto/create-order",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization": `Bearer ${tokenLocal}`
    },
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

/* STRIPE - แก้ไข Headers */

async function payStripe(){
/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: payment.js
VERSION: v12.1.0 (TrueMoney Restored | No Omise)
STATUS: production-enterprise
===================================================== */

const API_BASE = window.CONFIG ? window.CONFIG.API_BASE_URL : "https://api.sn-designstudio.dev";
const FRONTEND_BASE = "https://sn-designstudio.dev";

const paymentBox = document.getElementById("paymentBox");
const statusEl = document.getElementById("paymentStatus");

let CURRENT_METHOD = null;
let TX_LOCK = false;
let POLL_INTERVAL = null;
let TIMER_INTERVAL = null;

/* STATUS CONTROL */
function setStatus(text) {
    if (statusEl) statusEl.innerText = "STATUS: " + text;
}

/* RESET UI */
function resetUI() {
    if (paymentBox) paymentBox.innerHTML = "";
    if (TIMER_INTERVAL) clearInterval(TIMER_INTERVAL);
}

/* AUTH GUARD */
async function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) { window.location.replace(`${FRONTEND_BASE}/login.html`); return false; }
    try {
        const res = await fetch(`${API_BASE}/auth/me`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
        });
        return res.status === 200;
    } catch (err) { return false; }
}

/* METHOD RENDERER */
function renderMethodUI(method) {
    if (method === "truemoney") {
        paymentBox.innerHTML = `<button id="confirmBtn" class="engine-btn" style="background:#ff7a00; color:white;">ชำระผ่าน TrueMoney Wallet (Give Link)</button>`;
    }

    if (method === "promptpay") {
        paymentBox.innerHTML = `
      <input type="number" id="qrAmount" placeholder="ขั้นต่ำ 5 บาท" min="5" style="padding:10px; border-radius:5px; border:1px solid #ccc; margin-bottom:10px; width:80%;">
      <button id="confirmBtn" class="engine-btn" style="background:#6a1b9a; color:white;">สร้าง QR PromptPay</button>
    `;
    }

    if (method === "crypto") {
        paymentBox.innerHTML = `
      <select id="usdSelect" class="engine-btn" style="background:#333; margin-bottom:5px;"><option value="10">10 USD</option></select>
      <button id="confirmBtn" class="engine-btn" style="background:#ffd600; color:black;">ชำระด้วย Crypto</button>
    `;
    }

    if (method === "stripe") {
        paymentBox.innerHTML = `<button id="confirmBtn" class="engine-btn" style="background:#635bff; color:white;">Stripe Checkout</button>`;
    }

    const btn = document.getElementById("confirmBtn");
    if (btn) btn.addEventListener("click", handleConfirm);
}

/* ROUTER */
async function handleConfirm() {
    if (TX_LOCK) return setStatus("TRANSACTION LOCKED");
    TX_LOCK = true;
    setStatus("PROCESSING...");

    if (CURRENT_METHOD === "truemoney") return payTrueMoney();
    if (CURRENT_METHOD === "promptpay") return payPromptPay();
    if (CURRENT_METHOD === "crypto") return payCrypto();
    if (CURRENT_METHOD === "stripe") return payStripe();
}

/* 🟠 TRUEMONEY (GIVE LINK SYSTEM) - RESTORED */
async function payTrueMoney() {
    const tokenLocal = localStorage.getItem("token");
    const res = await fetch(API_BASE + "/api/omise/create-truewallet", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenLocal}` },
        body: JSON.stringify({ product: "credit_pack_1" })
    });
    const data = await res.json();
    if (data.authorizeUri) window.location.href = data.authorizeUri;
    else { setStatus("FAILED"); TX_LOCK = false; }
}

/* 🟣 PROMPTPAY (MIN 5 THB & TIMER) */
async function payPromptPay() {
    const tokenLocal = localStorage.getItem("token");
    const amount = parseFloat(document.getElementById("qrAmount")?.value);

    if (!amount || amount < 5) {
        setStatus("ขั้นต่ำ 5 บาท");
        TX_LOCK = false;
        return;
    }

    const res = await fetch(API_BASE + "/api/scb/create-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenLocal}` },
        body: JSON.stringify({ amount })
    });
    const data = await res.json();

    if (data.qrImage) {
        const qrModal = document.getElementById("qrModal");
        document.getElementById("qrFrame").innerHTML = `<img src="${data.qrImage}" width="250">`;
        document.getElementById("displayAmount").innerText = amount.toFixed(2);
        qrModal.style.display = "flex";
        startTimer(300); // 5 Mins
        startPolling(data.txId);
    } else {
        setStatus("ERROR"); TX_LOCK = false;
    }
}

/* TIMER SYSTEM */
function startTimer(duration) {
    let timer = duration;
    const display = document.getElementById("qrTimer");
    if (TIMER_INTERVAL) clearInterval(TIMER_INTERVAL);
    TIMER_INTERVAL = setInterval(() => {
        let mins = parseInt(timer / 60, 10);
        let secs = parseInt(timer % 60, 10);
        display.innerText = `QR จะหมดอายุใน ${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
        if (--timer < 0) {
            clearInterval(TIMER_INTERVAL);
            display.innerText = "QR หมดอายุแล้ว";
            document.getElementById("qrFrame").style.opacity = "0.2";
            TX_LOCK = false;
        }
    }, 1000);
}

/* CRYPTO / STRIPE / POLLING (SAME AS PREVIOUS) */
async function payCrypto() { /* ...เดิม... */ }
async function payStripe() { /* ...เดิม... */ }

function startPolling(txId) {
    const tokenLocal = localStorage.getItem("token");
    POLL_INTERVAL = setInterval(async () => {
        const res = await fetch(API_BASE + "/api/payment/status?tx=" + txId, {
            headers: { "Authorization": `Bearer ${tokenLocal}` }
        });
        const data = await res.json();
        if (data.status === "success") {
            document.getElementById("qrModal").style.display = "none";
            clearInterval(POLL_INTERVAL);
            clearInterval(TIMER_INTERVAL);
            TX_LOCK = false;
            alert("ชำระเงินสำเร็จ!");
        }
    }, 5000);
}

/* INIT */
document.addEventListener("DOMContentLoaded", async () => {
    const ok = await checkAuth();
    if (!ok) return;
    document.querySelectorAll("[data-method]").forEach(el => {
        el.addEventListener("click", () => {
            const method = el.dataset.method;
            if (method) { CURRENT_METHOD = method; resetUI(); renderMethodUI(method); }
        });
    });
    document.getElementById("closeQr").onclick = () => {
        document.getElementById("qrModal").style.display = "none";
        TX_LOCK = false;
        if (POLL_INTERVAL) clearInterval(POLL_INTERVAL);
        if (TIMER_INTERVAL) clearInterval(TIMER_INTERVAL);
    };
});
