const API_BASE = "https://api.sn-designstudio.dev";
const paymentBox = document.getElementById("paymentBox");
const statusEl = document.getElementById("paymentStatus");
const qrModal = document.getElementById("qrModal");

let CURRENT_METHOD = null;
let TX_LOCK = false;

function setMethod(method) {
    CURRENT_METHOD = method;
    if(statusEl) statusEl.innerText = "STATUS: SELECTING AMOUNT";
    paymentBox.innerHTML = `
        <div class="glass-card p-10 rounded-[3rem] border border-blue-500/20 w-full max-w-[500px] mx-auto text-center animate-fadeIn">
            <p class="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-6">${method.toUpperCase()}</p>
            <div class="relative mb-6">
                <span class="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-500">THB</span>
                <input type="number" id="payAmount" value="10" min="10" class="w-full bg-black/60 border-2 border-white/5 rounded-[2rem] py-6 px-14 text-4xl font-black text-white focus:border-blue-500 outline-none">
            </div>
            <button id="confirmBtn" class="w-full bg-blue-500 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em]">CONFIRM PAYMENT</button>
        </div>`;
    document.getElementById("confirmBtn").addEventListener("click", handleConfirm);
    paymentBox.scrollIntoView({ behavior: 'smooth' });
}

async function handleConfirm() {
    if (TX_LOCK) return;
    const amount = parseInt(document.getElementById("payAmount").value);
    if (amount < 10) { alert("ขั้นต่ำ 10 บาทครับพาร์ทเนอร์"); return; }
    TX_LOCK = true;
    if (statusEl) statusEl.innerText = "STATUS: GENERATING QR...";
    
    try {
        const res = await fetch(API_BASE + "/api/scb/create-qr", {
            method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount })
        });
        const data = await res.json();
        if (data.qrImage) {
            document.getElementById("qrFrame").innerHTML = `<img src="${data.qrImage}" class="w-full rounded-2xl">`;
            document.getElementById("displayAmount").innerText = amount;
            qrModal.style.display = "flex";
            if (statusEl) statusEl.innerText = "STATUS: WAITING PAYMENT";
        }
    } catch (e) {
        TX_LOCK = false;
        if (statusEl) statusEl.innerText = "STATUS: ERROR";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-method]").forEach(el => {
        el.addEventListener("click", () => setMethod(el.dataset.method));
    });
    const closeBtn = document.getElementById("closeQr");
    if(closeBtn) closeBtn.onclick = () => { qrModal.style.display="none"; TX_LOCK=false; if(statusEl) statusEl.innerText="STATUS: IDLE"; };
});
