let hmInterval = null;

function controlHamster(action) {
    const statusEl = document.getElementById('hmState');
    if (action === 'start') {
        if(statusEl) {
            statusEl.className = 'px-2 py-1 bg-green-900/50 text-green-400 text-[9px] rounded font-bold uppercase pulse-dot whitespace-nowrap flex-shrink-0';
            statusEl.innerText = 'FARMING';
        }
        showToast('Hamster Bot Started', 'success');

        if (hmInterval) clearInterval(hmInterval);
        
        appendHmTerminal('[SYS] Termux Engine Connected...', 'text-cyan-400');
        appendHmTerminal('[SYS] Verifying License...', 'text-cyan-400');
        
        hmInterval = setInterval(() => {
            const actions = ['Tapping...', 'Checking Promo...', 'Claiming Cipher...', 'Syncing State...'];
            const act = actions[Math.floor(Math.random() * actions.length)];
            const coins = (Math.random() * 100).toFixed(0);
            appendHmTerminal(`> ${act} | +${coins} Coins`, 'text-green-400');
        }, 2000);
    } else {
        if(statusEl) {
            statusEl.className = 'px-2 py-1 bg-gray-800 text-gray-400 text-[9px] rounded font-bold uppercase whitespace-nowrap flex-shrink-0';
            statusEl.innerText = 'OFFLINE';
        }
        showToast('Hamster Bot Stopped', 'error');
        if (hmInterval) clearInterval(hmInterval);
        appendHmTerminal('[SYS] Bot Process Terminated.', 'text-red-400');
    }
}

function appendHmTerminal(text, colorClass) {
    const term = document.getElementById('hmTerminal');
    if(!term) return;
    const line = document.createElement('div');
    line.className = 'termux-line truncate ' + colorClass;
    line.innerText = text;
    term.appendChild(line);
    
    // บังคับลบเมื่อเกิน 5 บรรทัด เพื่อไม่ให้กล่องขยายความสูง
    while (term.childElementCount > 5) {
        term.removeChild(term.firstChild);
    }
    term.scrollTop = term.scrollHeight;
}

