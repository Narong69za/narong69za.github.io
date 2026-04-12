const API_BASE = "https://api.sn-designstudio.dev";
const paymentBox = document.getElementById("paymentBox");
const qrModal = document.getElementById("qrModal");

function setMethod(method) {
    paymentBox.innerHTML = `
        <div class="glass-card p-10 rounded-[3rem] border border-cyan-500/20 w-full max-w-[500px] mx-auto text-center">
            <p class="text-[10px] font-bold text-cyan-400 uppercase mb-6">${method.toUpperCase()}</p>
            <div class="relative mb-6">
                <input type="number" id="payAmount" value="10" min="10" class="w-full bg-black border border-white/10 rounded-xl py-4 text-3xl font-bold text-white text-center outline-none">
            </div>
            <button id="confirmBtn" class="w-full bg-blue-500 text-white py-4 rounded-xl font-bold uppercase">CONFIRM PAYMENT</button>
        </div>`;
    document.getElementById("confirmBtn").onclick = async () => {
        const amount = parseInt(document.getElementById("payAmount").value);
        if (amount < 10) return alert("ขั้นต่ำ 10 บาท");
        try {
            const res = await fetch(`${API_BASE}/api/scb/create-qr`, {
                method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount })
            });
            const data = await res.json();
            if (data.qrImage) {
                document.getElementById("qrFrame").innerHTML = `<img src="${data.qrImage}" class="w-full rounded-2xl">`;
                document.getElementById("displayAmount").innerText = amount;
                qrModal.style.display = "flex";
            }
        } catch (e) { alert("เชื่อมต่อ Server ล้มเหลว เช็ค API_BASE อีกครั้ง"); }
    };
}

document.querySelectorAll("[data-method]").forEach(el => {
    el.addEventListener("click", () => setMethod(el.dataset.method));
});
if(document.getElementById("closeQr")) document.getElementById("closeQr").onclick = () => { qrModal.style.display="none"; };
