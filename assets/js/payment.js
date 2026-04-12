const API_BASE = "https://api.sn-designstudio.dev";
const FRONTEND_BASE = "https://sn-designstudio.dev";
const paymentBox = document.getElementById("paymentBox");
let CURRENT_METHOD=null, TX_LOCK=false, POLL_INTERVAL=null;

async function checkAuth(){
  try{
    const res = await fetch(`${API_BASE}/auth/me`,{ credentials: "include" });
    if(res.status!==200){ window.location.replace(`${FRONTEND_BASE}/login.html`); return false; }
    return true;
  }catch(err){ window.location.replace(`${FRONTEND_BASE}/login.html`); return false; }
}

async function handleConfirm(){
  if(TX_LOCK) return;
  TX_LOCK=true;
  if(CURRENT_METHOD==="promptpay") return payPromptPay();
  if(CURRENT_METHOD==="truemoney") return payTrueMoney();
}

async function payPromptPay(){
  const amount=parseInt(document.getElementById("qrAmount").value);
  const res = await fetch(API_BASE+"/api/scb/create-qr",{
    method:"POST",
    credentials: "include",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({amount})
  });
  const data = await res.json();
  if(data.qrImage){
    document.getElementById("qrFrame").innerHTML = `<img src="${data.qrImage}" width="250">`;
    document.getElementById("qrModal").style.display = "flex";
    startPolling(data.txId);
  }
}

function startPolling(txId){
  POLL_INTERVAL=setInterval(async()=>{
    const res = await fetch(API_BASE+"/api/payment/status?tx="+txId,{ credentials: "include" });
    const data = await res.json();
    if(data.status==="success"){
      alert("สำเร็จ!");
      window.location.reload();
    }
  },5000);
}

document.addEventListener("DOMContentLoaded", async () => {
    if(await checkAuth()){
        document.querySelectorAll("[data-method]").forEach(el => {
            el.onclick = () => { CURRENT_METHOD=el.dataset.method; renderMethodUI(CURRENT_METHOD); };
        });
    }
});

