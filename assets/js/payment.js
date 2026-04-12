/* =====================================================
MODULE: payment.js (v13.0.0 - PRODUCTION STABLE)
===================================================== */
const API_BASE = "https://api.sn-designstudio.dev";
const FRONTEND_BASE = "https://sn-designstudio.dev";

// เชื่อมต่อ UI Elements
const paymentBox = document.getElementById("paymentBox");
const statusEl = document.getElementById("paymentStatus");
const qrModal = document.getElementById("qrModal");
const timerFill = document.getElementById("timerFill");
const timeLeft = document.getElementById("timeLeft");

let CURRENT_METHOD = null;
let TX_LOCK = false;
let POLL_INTERVAL = null;
let TIMER_INTERVAL = null;

function setStatus(text) { if (statusEl) statusEl.innerText = "STATUS: " + text; }
function resetUI() { if (paymentBox) paymentBox.innerHTML = ""; }

/* 1. ระบบเลือกช่องทาง (Logic เชื่อมต่อ UI) */
function setMethod(method) {
    CURRENT_METHOD = method;
    resetUI();
    renderMethodUI(method);
    // เลื่อนหน้าจอมาที่จุดกรอกเงิน
    paymentBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* 2. วาดช่องกรอกเงิน (Smart Input) */
function renderMethodUI(method) {
    let title = "";
    if(method === "promptpay") title = "PROMPTPAY QR";
    else if(method === "truemoney") title = "TRUEMONEY WALLET";
    else if(method === "stripe") title = "STRIPE GLOBAL";
    else if(method === "crypto") title = "CRYPTO GATEWAY";

    // วาด HTML ลงใน paymentBox
    paymentBox.innerHTML = `
        <div class="glass-card p-10 rounded-[3rem] border border-blue-500/20 w-full max-w-[500px] mx-auto text-center shadow-2xl animate-fadeIn">
            <p class="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-6">${title}</p>
            
            <div class="relative mb-6">
                <span class="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-500">THB</span>
                <input type="number" id="payAmount" value="10" min="10" 
                    class="w-full bg-black/60 border-2 border-white/5 rounded-[2rem] py-6 px-14 text-4xl font-black text-white focus:border-blue-500 transition-all outline-none">
            </div>

            <button id="confirmBtn" class="w-full bg-blue-500 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-blue-500/20 shadow-2xl">
                CONFIRM TRANSACTION
            </button>
        </div>
    `;

    // ผูก Event ให้ปุ่มยืนยัน
    document.getElementById("confirmBtn").addEventListener("click", handleConfirm);
}

/* 3. จัดการการส่งข้อมูล API */
async function handleConfirm() {
    if (TX_LOCK) return;
    
    const amountInput = document.getElementById("payAmount");
    const amount = amountInput ? parseInt(amountInput.value) : 0;

    if (amount < 10) {
        alert("Minimum amount is 10 THB");
        return;
    }

    TX_LOCK = true;
    setStatus("GENERATING...");

    // แยกยิงตาม Method
    if (CURRENT_METHOD === "promptpay") return payPromptPay(amount);
    if (CURRENT_METHOD === "truemoney") return payTrueMoney(amount);
    if (CURRENT_METHOD === "stripe") return payStripe(amount);
}

/* 4. API: PROMPTPAY */
async function payPromptPay(amount) {
    try {
        const res = await fetch(API_BASE + "/api/scb/create-qr", {
            method: "POST", 
            credentials: "include", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount })
        });
        const data = await res.json();
        if (data.qrImage) {
            document.getElementById("qrFrame").innerHTML = `<img src="${data.qrImage}" class="w-full rounded-2xl">`;
            document.getElementById("displayAmount").innerText = amount.toLocaleString();
            qrModal.style.display = "flex";
            startTimer(300); // 5 นาที
            startPolling(data.txId);
        } else { throw new Error(); }
    } catch (e) { 
        setStatus("ERROR CREATING QR"); 
        TX_LOCK = false; 
    }
}

/* 5. API: TRUEMONEY */
async function payTrueMoney(amount) {
    try {
        const res = await fetch(API_BASE + "/api/truemoney/create-link", {
            method: "POST", 
            credentials: "include", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount })
        });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
        else { setStatus("FAILED"); TX_LOCK = false; }
    } catch (e) { setStatus("TMN ERROR"); TX_LOCK = false; }
}

/* 6. API: STRIPE */
async function payStripe(amount) {
    try {
        const res = await fetch(API_BASE + "/api/stripe/create-checkout", {
            method: "POST", 
            credentials: "include", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount })
        });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
    } catch (e) { setStatus("STRIPE ERROR"); TX_LOCK = false; }
}

/* 7. ระบบนับถอยหลัง & ตรวจสอบสถานะชำระเงิน */
function startTimer(duration) {
    if (TIMER_INTERVAL) clearInterval(TIMER_INTERVAL);
    let timer = duration;
    TIMER_INTERVAL = setInterval(() => {
        let mins = parseInt(timer / 60, 10);
        let secs = parseInt(timer % 60, 10);
        timeLeft.textContent = `Please pay within ${mins < 10 ? "0"+mins : mins}:${secs < 10 ? "0"+secs : secs} min`;
        timerFill.style.width = (timer / duration * 100) + "%";
        if (--timer < 0) {
            clearInterval(TIMER_INTERVAL);
            closeModal();
        }
    }, 1000);
}

function startPolling(txId) {
    if (POLL_INTERVAL) clearInterval(POLL_INTERVAL);
    POLL_INTERVAL = setInterval(async () => {
        try {
            const res = await fetch(`${API_BASE}/api/payment/status?tx=${txId}`, { credentials: "include" });
            const data = await res.json();
            if (data.status === "success") {
                clearInterval(POLL_INTERVAL);
                clearInterval(TIMER_INTERVAL);
                alert("Payment Success!");
                window.location.href = "/create.html";
            }
        } catch (e) { console.log("Polling..."); }
    }, 5000);
}

function closeModal() {
    qrModal.style.display = "none";
    TX_LOCK = false;
    setStatus("IDLE");
    if (POLL_INTERVAL) clearInterval(POLL_INTERVAL);
    if (TIMER_INTERVAL) clearInterval(TIMER_INTERVAL);
}

/* 8. เริ่มต้นระบบ */
document.addEventListener("DOMContentLoaded", () => {
    // ผูก Click Event ให้กับการ์ดเลือกช่องทาง
    document.querySelectorAll("[data-method]").forEach(el => {
        el.addEventListener("click", () => {
            setMethod(el.dataset.method);
        });
    });

    const closeBtn = document.getElementById("closeQr");
    if (closeBtn) closeBtn.onclick = closeModal;
});

