/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: payment.js
VERSION: v12.1.2 (STABLE COOKIE AUTH)
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

/* --- 1. STATUS & UI CONTROL --- */
function setStatus(text) {
    if (statusEl) statusEl.innerText = "STATUS: " + text;
}

function resetUI() {
    if (paymentBox) paymentBox.innerHTML = "";
    if (TIMER_INTERVAL) clearInterval(TIMER_INTERVAL);
    if (POLL_INTERVAL) clearInterval(POLL_INTERVAL);
    TX_LOCK = false;
}

/* --- 2. AUTH GUARD (แก้ไขเฉพาะจุด) --- */
async function checkAuth() {
    try {
        const res = await fetch(`${API_BASE}/auth/me`, {
            method: "GET",
            credentials: "include", // ใช้ Cookie แทน localStorage
            headers: { "Content-Type": "application/json" }
        });
        return res.status === 200;
    } catch (err) {
        return false;
    }
}

/* --- 3. RENDER UI (โครงสร้างเดิมมึงทั้งหมด) --- */
function renderMethodUI(method) {
    if (method === "truemoney") {
        paymentBox.innerHTML = `
            <div class="method-confirm-area">
                <p style="color:#ff7a00; margin-bottom:10px;">ชำระผ่าน TrueMoney Wallet (ระบบ Give Link)</p>
                <button id="confirmBtn" class="engine-btn" style="background:#ff7a00; color:white;">ยืนยันการเชื่อมต่อ WALLET</button>
            </div>`;
    }

    if (method === "promptpay") {
        paymentBox.innerHTML = `
            <div class="method-confirm-area">
                <input type="number" id="qrAmount" placeholder="ระบุจำนวนเงิน (ขั้นต่ำ 5 บาท)" min="5" style="padding:12px; border-radius:10px; border:1px solid #ddd; margin-bottom:15px; width:90%; font-size:16px;">
                <button id="confirmBtn" class="engine-btn" style="background:#6a1b9a; color:white;">GENERATE QR PROMPTPAY</button>
            </div>`;
    }

    if (method === "crypto") {
        paymentBox.innerHTML = `
            <div class="method-confirm-area">
                <select id="usdSelect" class="engine-btn" style="background:#333; margin-bottom:10px; width:90%;">
                    <option value="10">10 USD</option>
                    <option value="20">20 USD</option>
                    <option value="50">50 USD</option>
                </select>
                <select id="coinSelect" class="engine-btn" style="background:#444; margin-bottom:15px; width:90%;">
                    <option value="USDT">USDT (TRC20)</option>
                    <option value="BNB">BNB (BEP20)</option>
                    <option value="TON">TON</option>
                </select>
                <button id="confirmBtn" class="engine-btn" style="background:#ffd600; color:black;">OPEN CRYPTO GATEWAY</button>
            </div>`;
    }

    if (method === "stripe") {
        paymentBox.innerHTML = `
            <div class="method-confirm-area">
                <p style="color:#635bff; margin-bottom:10px;">Global Credit/Debit Card via Stripe</p>
                <button id="confirmBtn" class="engine-btn" style="background:#635bff; color:white;">PROCEED TO CHECKOUT</button>
            </div>`;
    }

    const btn = document.getElementById("confirmBtn");
    if (btn) btn.addEventListener("click", handleConfirm);
}

/* --- 4. PAYMENT ROUTER --- */
async function handleConfirm() {
    if (TX_LOCK) return setStatus("TRANSACTION LOCKED");
    TX_LOCK = true;
    setStatus("PROCESSING...");

    if (CURRENT_METHOD === "truemoney") return payTrueMoney();
    if (CURRENT_METHOD === "promptpay") return payPromptPay();
    if (CURRENT_METHOD === "crypto") return payCrypto();
    if (CURRENT_METHOD === "stripe") return payStripe();
}

/* --- 5. PAYMENT LOGIC (แก้ไขเฉพาะจุดส่ง Token) --- */

async function payTrueMoney() {
    const res = await fetch(`${API_BASE}/api/omise/create-truewallet`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "credit_pack_1" })
    });
    const data = await res.json();
    if (data.authorizeUri) window.location.href = data.authorizeUri;
    else { 
        setStatus("FAILED"); 
        TX_LOCK = false;
    }
}

async function payPromptPay() {
    const amount = parseFloat(document.getElementById("qrAmount")?.value);
    if (!amount || amount < 5) {
        alert("กรุณาระบุจำนวนเงินขั้นต่ำ 5 บาท");
        setStatus("INVALID AMOUNT");
        TX_LOCK = false;
        return;
    }

    const res = await fetch(`${API_BASE}/api/scb/create-qr`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount })
    });
    const data = await res.json();

    if (data.qrImage) {
        document.getElementById("qrFrame").innerHTML = `<img src="${data.qrImage}" width="250">`;
        document.getElementById("displayAmount").innerText = amount.toFixed(2);
        
        const downloadContainer = document.getElementById("downloadContainer");
        if (downloadContainer) {
            downloadContainer.innerHTML = ''; 
            const downloadBtn = document.createElement("a");
            downloadBtn.innerText = " ดาวน์โหลด QR Code";
            downloadBtn.classList.add("download-qr-btn");
            downloadBtn.href = data.qrImage; 
            downloadBtn.download = `SN-PromptPay-${amount.toFixed(2)}THB-${Date.now()}.png`; 
            downloadContainer.appendChild(downloadBtn);
        }

        document.getElementById("qrModal").style.display = "flex";
        startTimer(300);
        startPolling(data.txId);
    } else {
        setStatus("ERROR"); TX_LOCK = false;
    }
}

async function payCrypto() {
    const usd = document.getElementById("usdSelect").value;
    const coin = document.getElementById("coinSelect").value;
    const res = await fetch(`${API_BASE}/api/crypto/create-order`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usd, coin })
    });
    const data = await res.json();
    if (data.paymentUrl) window.location.href = data.paymentUrl;
    else { setStatus("ERROR"); TX_LOCK = false; }
}

async function payStripe() {
    const res = await fetch(`${API_BASE}/api/stripe/create-session`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "credit_pack_1" })
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else { 
        setStatus("FAILED"); 
        TX_LOCK = false;
    }
}

/* --- 6. UTILS (TIMER & POLLING) --- */
function startTimer(duration) {
    let timer = duration;
    const display = document.getElementById("qrTimer");
    if (TIMER_INTERVAL) clearInterval(TIMER_INTERVAL);
    TIMER_INTERVAL = setInterval(() => {
        let mins = Math.floor(timer / 60);
        let secs = timer % 60;
        display.innerText = `QR จะหมดอายุใน ${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
        if (--timer < 0) {
            clearInterval(TIMER_INTERVAL);
            display.innerText = "QR หมดอายุแล้ว";
            document.getElementById("qrFrame").style.opacity = "0.2";
            TX_LOCK = false;
        }
    }, 1000);
}

function startPolling(txId) {
    if (POLL_INTERVAL) clearInterval(POLL_INTERVAL);
    POLL_INTERVAL = setInterval(async () => {
        try {
            const res = await fetch(`${API_BASE}/api/payment/status?tx=${txId}`, {
                credentials: "include"
            });
            const data = await res.json();
            if (data.status === "success") {
                clearInterval(POLL_INTERVAL);
                clearInterval(TIMER_INTERVAL);
                document.getElementById("qrModal").style.display = "none";
                alert("ชำระเงินสำเร็จ!");
                window.location.reload();
            }
        } catch (e) { console.error("Polling error"); }
    }, 5000);
}

/* --- 7. INITIALIZE --- */
document.addEventListener("DOMContentLoaded", async () => {
    const ok = await checkAuth();
    if (!ok) {
        window.location.replace(`${FRONTEND_BASE}/login.html`);
        return;
    }

    document.querySelectorAll("[data-method]").forEach(el => {
        el.addEventListener("click", () => {
            const method = el.dataset.method;
            if (method) {
                CURRENT_METHOD = method;
                resetUI();
                renderMethodUI(method);
                paymentBox.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const closeBtn = document.getElementById("closeQr");
    if (closeBtn) {
        closeBtn.onclick = () => {
            document.getElementById("qrModal").style.display = "none";
            resetUI();
        };
    }
});

