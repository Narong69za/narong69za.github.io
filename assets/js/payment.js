const API_BASE = "https://api.sn-designstudio.dev";
const paymentBox = document.getElementById("paymentBox");
const qrModal = document.getElementById("qrModal");
const statusEl = document.getElementById("paymentStatus");

let CURRENT_METHOD = null, TX_LOCK = false;

function setMethod(method) {
    CURRENT_METHOD = method;
    paymentBox.innerHTML = `
        <div class="glass-card p-8 rounded-[2rem] border border-blue-500/20 w-full max-w-sm mx-auto text-center">
            <p class="text-[10px] font-bold text-blue-400 uppercase mb-4">${method.toUpperCase()}</p>
            <input type="number" id="payAmount" value="10" min="10" 
                class="w-full bg-black border border-white/10 rounded-xl py-4 text-3xl font-bold text-white text-center outline-none mb-4">
            <button id="confirmBtn" class="w-full bg-blue-500 text-white py-4 rounded-xl font-bold uppercase">Confirm Payment</button>
        </div>`;
    document.getElementById("confirmBtn").onclick = handleConfirm;
}

async function handleConfirm() {
    if (TX_LOCK) return;
    const amount = parseInt(document.getElementById("payAmount").value);
    if (amount < 10) { alert("ขั้นต่ำ 10 บาท"); return; }
    
    TX_LOCK = true;
    if(statusEl) statusEl.innerText = "STATUS: GENERATING...";

    try {
        const res = await fetch(API_BASE + "/api/scb/create-qr", {
            method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount })
        });
        const data = await res.json();
        if (data.qrImage) {
            document.getElementById("qrFrame").innerHTML = `<img src="${data.qrImage}" class="w-full rounded-xl">`;
            document.getElementById("displayAmount").innerText = amount;
            qrModal.style.display = "flex";
            if(statusEl) statusEl.innerText = "STATUS: WAITING PAYMENT";
        }
    } catch (e) {
        TX_LOCK = false;
        alert("Error Connecting to Server");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-method]").forEach(el => {
        el.onclick = () => setMethod(el.dataset.method);
    });
    const closeBtn = document.getElementById("closeQr");
    if(closeBtn) closeBtn.onclick = () => { qrModal.style.display="none"; TX_LOCK=false; };
});
