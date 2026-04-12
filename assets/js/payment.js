const API_BASE = "https://api.sn-designstudio.dev";

function openPremiumQR(qrData, amount) {
    const modal = document.createElement('div');
    modal.className = "fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fadeIn";
    modal.innerHTML = `
        <div class="bg-[#050505] w-full max-w-sm rounded-[3.5rem] p-12 text-center border border-emerald-500/20 shadow-[0_0_80px_rgba(16,185,129,0.1)] relative overflow-hidden">
            <div id="pBar" class="absolute top-0 left-0 h-[2px] bg-emerald-500 transition-all duration-1000 w-full shadow-[0_0_10px_#10b981]"></div>
            
            <p class="text-[10px] font-black text-emerald-500 tracking-[0.5em] uppercase mb-3">SCB MASTER GATEWAY</p>
            <h2 class="text-5xl font-black italic mb-8 text-white">${amount}.00 <span class="text-xs font-light text-emerald-900 italic">THB</span></h2>
            
            <div class="bg-white p-6 rounded-[2.5rem] mb-8 relative group shadow-[0_0_40px_rgba(255,255,255,0.05)]">
                <img src="${qrData}" class="w-full h-auto rounded-2xl" id="finalQR">
                <button onclick="downloadQR('${qrData}')" class="absolute inset-0 bg-emerald-500/90 text-black opacity-0 group-hover:opacity-100 transition-all rounded-[2.5rem] font-black flex items-center justify-center gap-2 uppercase text-[10px] tracking-tighter">
                    Download Official QR
                </button>
            </div>

            <div class="space-y-6">
                <p id="timerText" class="text-xs font-black font-mono text-emerald-900 uppercase tracking-widest">EXPIRES IN: 05:00</p>
                <div class="pt-8 border-t border-emerald-500/10">
                    <p class="text-[9px] text-emerald-500/30 tracking-[0.6em] font-black uppercase">Powered By snd studio</p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    startCountdown(300, 'pBar', 'timerText', modal);
}

function startCountdown(sec, barId, textId, modal) {
    let timer = sec;
    const interval = setInterval(() => {
        let min = Math.floor(timer / 60);
        let s = timer % 60;
        const textEl = document.getElementById(textId);
        if(textEl) textEl.innerText = `EXPIRES IN: ${min < 10 ? '0'+min : min}:${s < 10 ? '0'+s : s}`;
        
        const barEl = document.getElementById(barId);
        if(barEl) barEl.style.width = (timer / sec * 100) + "%";
        
        if (--timer < 0) { clearInterval(interval); modal.remove(); }
    }, 1000);
}

function downloadQR(data) {
    const a = document.createElement('a');
    a.href = data; 
    a.download = `SN-PAYMENT-QR-${Date.now()}.png`; 
    a.click();
}
