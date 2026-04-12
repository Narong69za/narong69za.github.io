const API_BASE = "https://api.sn-designstudio.dev";
let CURRENT_METHOD = null, TX_LOCK = false, TIMER = null;

function setMethod(method) {
    CURRENT_METHOD = method;
    document.getElementById("paymentBox").innerHTML = `
        <div class="w-full max-w-sm text-center">
            <p class="text-xs font-bold text-blue-400 mb-4">${method.toUpperCase()}</p>
            <input type="number" id="payAmount" value="10" min="10" 
                class="w-full bg-black border border-white/10 rounded-xl p-4 text-2xl text-center text-white outline-none mb-4">
            <button id="confirmBtn" class="w-full bg-blue-500 text-white py-4 rounded-xl font-bold uppercase">ยืนยันการเติมเงิน</button>
        </div>`;
    document.getElementById("confirmBtn").onclick = handleConfirm;
}

async function handleConfirm() {
    if (TX_LOCK) return;
    const amount = parseInt(document.getElementById("payAmount").value);
    if (amount < 10) { alert("ขั้นต่ำ 10 บาท"); return; }
    
    TX_LOCK = true;
    document.getElementById("paymentStatus").innerText = "STATUS: GENERATING...";

    try {
        const res = await fetch(API_BASE + "/api/scb/create-qr", {
            method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount })
        });
        const data = await res.json();
        if (data.qrImage) {
            // โชว์ QR แบบเรียบง่าย ไม่เด้งบังหน้าจอ
            document.getElementById("paymentBox").style.display = "none";
            document.getElementById("qrDisplay").style.display = "block";
            document.getElementById("amtText").innerText = amount + " บาท";
            document.getElementById("qrFrame").innerHTML = `<img src="${data.qrImage}" class="w-full rounded-lg">`;
            startTimer(300);
            document.getElementById("paymentStatus").innerText = "STATUS: WAITING PAYMENT";
        }
    } catch (e) {
        TX_LOCK = false;
        alert("เกิดข้อผิดพลาดในการสร้างรายการ");
    }
}

function startTimer(sec) {
    if (TIMER) clearInterval(TIMER);
    TIMER = setInterval(() => {
        let m = Math.floor(sec / 60), s = sec % 60;
        document.getElementById("timerText").innerText = `หมดเวลาใน ${m}:${s < 10 ? '0'+s : s}`;
        if (sec-- <= 0) { clearInterval(TIMER); location.reload(); }
    }, 1000);
}

document.querySelectorAll("[data-method]").forEach(btn => {
    btn.onclick = () => setMethod(btn.dataset.method);
});
