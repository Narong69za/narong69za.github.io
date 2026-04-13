const API_BASE = "https://api.sn-designstudio.dev";

// ฟังก์ชันหลักในการเลือกช่องทางและเรียก API
async function setMethod(method) {
    const amountInput = document.getElementById("payAmount");
    const amount = amountInput?.value || 10;
    const email = localStorage.getItem('user_email');
    
    if (!email) {
        alert("Session Expired: กรุณาล็อคอินใหม่");
        window.location.href = "login.html";
        return;
    }

    let endpoint = "";
    if (method === "promptpay") endpoint = "/api/scb/create-qr";
    if (method === "truemoney") endpoint = "/api/truemoney/create-link";
    if (method === "stripe") endpoint = "/api/stripe/create-checkout";
    if (method === "crypto") return alert("Crypto coming soon with Hamster Project");

    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                amount: parseInt(amount),
                email: email,
                hwid: btoa(navigator.userAgent).substring(0, 16)
            })
        });
        const data = await res.json();
        
        if (data.success) {
            if (data.qrImage) {
                openPremiumQR(data.qrImage, amount);
                startPaymentPolling(email); // เริ่มตรวจสอบสถานะการจ่ายเงิน
            } else if (data.url) {
                window.location.href = data.url;
            }
        } else {
            alert("Error: " + data.message);
        }
    } catch (e) { alert("API Connection Failed"); }
}

// ระบบตรวจสอบสถานะการชำระเงินอัตโนมัติ (Redirect Logic)
function startPaymentPolling(email) {
    const checkStatus = setInterval(async () => {
        try {
            const res = await fetch(`${API_BASE}/api/auth/me?email=${email}`);
            const data = await res.json();
            // ถ้าเครดิตมีการอัปเดต (สมมติว่าเช็คจาก flag data.paid)
            if (data.paid_success) {
                clearInterval(checkStatus);
                alert("ชำระเงินสำเร็จ! กำลังพากลับไปหน้า AI Engine");
                window.location.href = "create.html";
            }
        } catch (e) { console.log("Checking payment..."); }
    }, 4000); // เช็คทุก 4 วินาที
}

function openPremiumQR(qrData, amount) {
    const modal = document.createElement('div');
    modal.id = "qr-modal-overlay";
    modal.className = "fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl";
    modal.innerHTML = `
        <div class="bg-[#050505] w-full max-w-sm rounded-[3.5rem] p-10 text-center border border-red-500/20 shadow-[0_0_80px_rgba(239,68,68,0.1)] relative overflow-hidden">
            <div id="pBar" class="absolute top-0 left-0 h-[3px] bg-red-600 w-full transition-all duration-1000"></div>
            <p class="text-[9px] font-black text-red-500 tracking-[0.5em] mb-4 uppercase">SN MASTER GATEWAY</p>
            <h2 class="text-5xl font-black italic mb-6 text-white">${amount}.00 <span class="text-xs text-red-900 italic">THB</span></h2>
            
            <div class="bg-white p-5 rounded-[2.5rem] mb-6 relative group border-[6px] border-[#111]">
                <img src="${qrData}" class="w-full h-auto rounded-xl">
                <img src="https://upload.wikimedia.org/wikipedia/th/thumb/c/cb/PromptPay-logo.png/1200px-PromptPay-logo.png" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 bg-white p-1 rounded-md border border-gray-100">
                <button onclick="downloadQR('${qrData}')" class="absolute inset-0 bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-all rounded-[2rem] font-black flex items-center justify-center uppercase text-xs tracking-widest">Download QR</button>
            </div>

            <p id="timerText" class="text-xs font-black text-red-900 uppercase">EXPIRES IN: 05:00</p>
            <div class="mt-6 flex gap-2">
                <button onclick="document.getElementById('qr-modal-overlay').remove()" class="w-full py-3 bg-[#111] rounded-full text-[9px] font-black uppercase text-gray-500 border border-white/5">Cancel</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    let timer = 300;
    const interval = setInterval(() => {
        let min = Math.floor(timer / 60), s = timer % 60;
        const text = modal.querySelector('#timerText'), bar = modal.querySelector('#pBar');
        if(text) text.innerText = `EXPIRES IN: ${min < 10 ? '0'+min : min}:${s < 10 ? '0'+s : s}`;
        if(bar) bar.style.width = (timer / 300 * 100) + "%";
        if (--timer < 0 || !document.getElementById('qr-modal-overlay')) { 
            clearInterval(interval); 
            if(timer < 0) modal.remove(); 
        }
    }, 1000);
}

window.downloadQR = (data) => {
    const a = document.createElement('a');
    a.href = data; a.download = `SN-QR-${Date.now()}.png`; a.click();
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll("[data-method]").forEach(el => {
        el.onclick = () => setMethod(el.dataset.method);
    });
});
