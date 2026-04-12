const API_BASE = "https://api.sn-designstudio.dev";
const paymentBox = document.getElementById("paymentBox");
const qrModal = document.getElementById("qrModal");

function setMethod(method) {
    paymentBox.innerHTML = `
        <div class="glass-card p-8 rounded-3xl border border-blue-500/20 w-full max-w-sm mx-auto text-center">
            <p class="text-[10px] font-bold text-blue-400 uppercase mb-4">${method.toUpperCase()}</p>
            <input type="number" id="payAmount" value="10" min="10" class="w-full bg-black border border-white/10 rounded-xl py-4 text-3xl font-bold text-white text-center outline-none mb-4">
            <button id="confirmBtn" class="w-full bg-blue-500 text-white py-4 rounded-xl font-bold uppercase">ยืนยันรายการ</button>
        </div>`;

    document.getElementById("confirmBtn").onclick = async () => {
        const amount = parseInt(document.getElementById("payAmount").value);
        if (amount < 10) return alert("ขั้นต่ำ 10 บาท");

        // เปิดใช้งานทุก Endpoint ตามระบบ Backend
        let endpoint = "";
        if (method === "promptpay") endpoint = "/api/scb/create-qr";
        else if (method === "truemoney") endpoint = "/api/truemoney/create-link";
        else if (method === "stripe") endpoint = "/api/stripe/create-checkout";
        else if (method === "crypto") endpoint = "/api/crypto/create-order";

        try {
            const res = await fetch(`${API_BASE}${endpoint}`, {
                method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount })
            });
            const data = await res.json();
            
            if (method === "promptpay" && data.qrImage) {
                document.getElementById("qrFrame").innerHTML = `<img src="${data.qrImage}" class="w-full rounded-2xl">`;
                document.getElementById("displayAmount").innerText = amount;
                qrModal.style.display = "flex";
            } else if (data.url || data.paymentUrl) {
                window.location.href = data.url || data.paymentUrl;
            }
        } catch (e) {
            alert("เชื่อมต่อ API ล้มเหลว ตรวจสอบสถานะ Backend Port 5002");
        }
    };
}

// ผูก Event ให้ทุกปุ่มที่มี data-method โดยไม่มีการปิดกั้น
document.querySelectorAll("[data-method]").forEach(el => {
    el.addEventListener("click", () => setMethod(el.dataset.method));
});

if(document.getElementById("closeQr")) {
    document.getElementById("closeQr").onclick = () => { qrModal.style.display="none"; };
}
