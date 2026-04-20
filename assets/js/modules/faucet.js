let faucetInterval = null;
let faucetTotal = 0.00000;

function registerFaucet(){
    document.getElementById("faucet-locked").style.display = "none";
    document.getElementById("faucet-content").classList.remove("blur-sm");
    localStorage.setItem("faucet_registered", "1");
    startTermuxBot();
}

function startTermuxBot(){
    if(faucetInterval) clearInterval(faucetInterval);
    const coins = ["USDT","BTC","ETH","BNB","TON","SOL"];
    const box = document.getElementById("termux-console");
    faucetInterval = setInterval(()=>{
        const coin = coins[Math.floor(Math.random()*coins.length)];
        const amt = (Math.random()*0.05).toFixed(5);
        faucetTotal += Number(amt);
        const line = document.createElement("div");
        line.className = "text-green-400 termux-line";
        line.innerText = `> Claim ${coin} : +${amt}`;
        box.appendChild(line);
        
        // ลบข้อความเก่าเพื่อไม่ให้กล่องยืด
        while(box.childElementCount > 6){ 
            box.removeChild(box.firstChild); 
        }
        box.scrollTop = box.scrollHeight;
        
        const disp = document.getElementById("faucet-dispensed");
        if(disp) disp.innerText = faucetTotal.toFixed(5);
    }, 2500);
}

