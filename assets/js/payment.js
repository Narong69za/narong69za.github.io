const API_BASE = "https://api.sn-designstudio.dev";

async function setMethod(method) {
    if (method === "crypto") return alert("ระบบ Crypto จะเปิดพร้อมโปรเจกต์ Hamster");
    
    const amount = document.getElementById("payAmount")?.value || 10;
    const statusEl = document.getElementById("paymentStatus");
    if(statusEl) statusEl.innerText = "STATUS: CONNECTING...";

    let endpoint = "";
    if (method === "promptpay") endpoint = "/api/scb/create-qr";
    else if (method === "truemoney") endpoint = "/api/truemoney/create-link";
    else if (method === "stripe") endpoint = "/api/stripe/create-checkout";

    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: parseInt(amount) })
        });
        const data = await res.json();

        if (data.success) {
            if (data.qrImage) {
                if(statusEl) statusEl.innerText = "STATUS: SCB READY";
                openPremiumQR(data.qrImage, amount);
            } else if (data.url || data.paymentUrl) {
                if(statusEl) statusEl.innerText = "STATUS: REDIRECTING...";
                window.location.href = data.url || data.paymentUrl;
            }
        } else { throw new Error(data.message || "API Error"); }
    } catch (e) {
        if(statusEl) statusEl.innerText = "STATUS: FAILED";
        alert("การเชื่อมต่อล้มเหลว ตรวจสอบพอร์ต 5002");
    }
}

function openPremiumQR(qrData, amount) {
    const modal = document.createElement('div');
    modal.className = "fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fadeIn";
    modal.innerHTML = `
        <div class="bg-[#050505] w-full max-w-sm rounded-[3.5rem] p-12 text-center border border-emerald-500/20 shadow-[0_0_80px_rgba(16,185,129,0.1)] relative overflow-hidden">
            <div id="pBar" class="absolute top-0 left-0 h-[2px] bg-emerald-500 w-full shadow-[0_0_10px_#10b981]"></div>
            <p class="text-[10px] font-black text-emerald-500 tracking-[0.5em] mb-3 uppercase">SCB MASTER GATEWAY</p>
            <h2 class="text-5xl font-black italic mb-8 text-white">${amount}.00 <span class="text-xs text-emerald-900">THB</span></h2>
            <div class="bg-white p-6 rounded-[2.5rem] mb-8 relative group shadow-[0_0_40px_rgba(255,255,255,0.05)]">
                <img src="${qrData}" class="w-full h-auto rounded-2xl">
                <button onclick="downloadQR('${qrData}')" class="absolute inset-0 bg-emerald-500/90 text-black opacity-0 group-hover:opacity-100 transition-all rounded-[2.5rem] font-black flex items-center justify-center uppercase text-[10px]">Download QR</button>
            </div>
            <p id="timerText" class="text-xs font-black font-mono text-emerald-900 uppercase">EXPIRES IN: 05:00</p>
            <p class="text-[9px] text-emerald-500/30 tracking-[0.6em] font-black uppercase mt-8">Powered By snd studio</p>
        </div>
    `;
    document.body.appendChild(modal);
    
    let timer = 300;
    const interval = setInterval(() => {
        let min = Math.floor(timer / 60), s = timer % 60;
        const text = modal.querySelector('#timerText'), bar = modal.querySelector('#pBar');
        if(text) text.innerText = `EXPIRES IN: ${min < 10 ? '0'+min : min}:${s < 10 ? '0'+s : s}`;
        if(bar) bar.style.width = (timer / 300 * 100) + "%";
        if (--timer < 0) { clearInterval(interval); modal.remove(); }
    }, 1000);
}

window.downloadQR = (data) => {
    const a = document.createElement('a');
    a.href = data; a.download = `SN-QR-${Date.now()}.png`; a.click();
};

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-method]").forEach(el => {
        el.onclick = () => setMethod(el.dataset.method);
    });
});
