const API_BASE = "https://api.sn-designstudio.dev";

async function setMethod(method) {
    const amount = document.getElementById("payAmount")?.value || 10;
    const phone = document.getElementById("payPhone")?.value;
    const idCard = document.getElementById("payIDCard")?.value;
    const email = localStorage.getItem('user_email');
    
    // Validate ข้อมูลก่อนยิง
    if (!phone || !idCard) return alert("กรุณากรอกเบอร์โทรและรหัสบัตรประชาชนให้ครบถ้วน");

    let endpoint = "";
    if (method === "promptpay") endpoint = "/api/scb/create-qr";
    if (method === "truemoney") endpoint = "/api/truemoney/create-link";
    if (method === "stripe") endpoint = "/api/stripe/create-checkout";

    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                amount: parseInt(amount), 
                email: email,
                phone: phone,      // ส่งเบอร์โทร
                id_card: idCard    // ส่งรหัสบัตรประชาชน
            })
        });
        const data = await res.json();
        if (data.success) {
            if (data.qrImage) {
                openPremiumQR(data.qrImage, amount);
                startPolling(email);
            }
            else if (data.url) window.location.href = data.url;
        }
    } catch (e) { alert("API Connection Failed"); }
}

function openPremiumQR(qrData, amount) {
    const modal = document.createElement('div');
    modal.id = "premium-qr-modal";
    modal.className = "fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl";
    modal.innerHTML = `
        <div class="bg-[#050505] w-full max-w-sm rounded-[3.5rem] p-10 text-center border border-red-500/20 shadow-[0_0_80px_rgba(239,68,68,0.15)] relative overflow-hidden">
            <div id="pBar" class="absolute top-0 left-0 h-[3px] bg-red-600 w-full transition-all duration-1000"></div>
            <p class="text-[9px] font-black text-red-500 tracking-[0.5em] mb-4 uppercase">SCB MASTER GATEWAY</p>
            <h2 class="text-5xl font-black italic mb-8 text-white">${amount}.00 <span class="text-xs text-red-900 italic">THB</span></h2>
            
            <div class="bg-white p-5 rounded-[2.5rem] mb-8 relative group border-[6px] border-[#111]">
                <img src="${qrData}" class="w-full h-auto rounded-2xl">
                <img src="https://upload.wikimedia.org/wikipedia/th/thumb/c/cb/PromptPay-logo.png/1200px-PromptPay-logo.png" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 bg-white p-1 rounded-md border border-gray-100">
                <button onclick="downloadQR('${qrData}')" class="absolute inset-0 bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-all rounded-[2rem] font-black flex items-center justify-center uppercase text-xs tracking-widest">Download QR</button>
            </div>
            
            <p id="timerText" class="text-xs font-black text-red-900 uppercase">EXPIRES IN: 05:00</p>
            <button onclick="document.getElementById('premium-qr-modal').remove()" class="mt-8 text-[9px] font-black text-gray-600 uppercase hover:text-white transition-colors">Cancel Payment</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    let timer = 300;
    const interval = setInterval(() => {
        let min = Math.floor(timer / 60), s = timer % 60;
        const text = modal.querySelector('#timerText'), bar = modal.querySelector('#pBar');
        if(text) text.innerText = `EXPIRES IN: ${min < 10 ? '0'+min : min}:${s < 10 ? '0'+s : s}`;
        if(bar) bar.style.width = (timer / 300 * 100) + "%";
        if (--timer < 0 || !document.getElementById('premium-qr-modal')) { 
            clearInterval(interval); 
            if(timer < 0) modal.remove(); 
        }
    }, 1000);
}

function startPolling(email) {
    const poll = setInterval(async () => {
        try {
            const res = await fetch(`${API_BASE}/api/auth/me?email=${email}`);
            const data = await res.json();
            if (data.paid_success) {
                clearInterval(poll);
                alert("ชำระเงินสำเร็จ! กำลังพากลับไปหน้า AI Engine");
                window.location.href = "create.html";
            }
        } catch (e) {}
    }, 4000);
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
