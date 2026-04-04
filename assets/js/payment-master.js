document.addEventListener("DOMContentLoaded", () => {
    // ผูก Event ให้กับปุ่มในแต่ละ Card (แยกกล่องใครกล่องมัน)
    // สำหรับ SCB / PromptPay
    const qrBtn = document.getElementById("btn-qr-pay");
    if(qrBtn) qrBtn.onclick = () => processPayment('qr');

    // สำหรับ Stripe
    const stripeBtn = document.getElementById("btn-stripe-pay");
    if(stripeBtn) stripeBtn.onclick = () => processPayment('stripe');

    // สำหรับ TrueMoney
    const tmnBtn = document.getElementById("btn-tmn-pay");
    if(tmnBtn) tmnBtn.onclick = () => processPayment('tmn');

    // สำหรับ Crypto
    const cryptoBtn = document.getElementById("btn-crypto-pay");
    if(cryptoBtn) cryptoBtn.onclick = () => processPayment('crypto');
});

async function processPayment(method) {
    const amount = document.getElementById("amount-input")?.value || 100;
    const statusEl = document.getElementById("payment-status-text");
    
    if(statusEl) statusEl.innerText = `Connecting to ${method.toUpperCase()} Gateway...`;

    try {
        let res, data;
        switch(method) {
            case 'qr': // SCB & PromptPay
                res = await fetch("https://api.sn-designstudio.dev/api/payment/generate-qr", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount, method: 'scb' })
                });
                data = await res.json();
                if(data.qrImage) showQRModal(data.qrImage, data.transactionId);
                break;

            case 'stripe':
                res = await fetch("https://api.sn-designstudio.dev/api/stripe/create-checkout-session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amountTHB: amount })
                });
                data = await res.json();
                if(data.url) window.location.href = data.url;
                break;

            case 'tmn': // TrueMoney Gift Link
                const giftLink = document.getElementById("tmn-gift-link").value;
                res = await fetch("https://api.sn-designstudio.dev/api/truemoney/topup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ giftLink })
                });
                data = await res.json();
                alert(data.message);
                break;

            case 'crypto':
                // ดึง Wallet Address มาแสดง
                alert("Crypto Address: 0xYourWalletAddressHere (Network: BEP20)");
                break;
        }
    } catch (e) { alert("Gateway Connection Failed!"); }
}

function showQRModal(img, txId) {
    // แสดง Modal สำหรับสแกน QR และเริ่ม Polling เช็คสถานะ
    const modal = document.getElementById("qr-modal");
    document.getElementById("qr-img-display").src = img;
    modal.style.display = "flex";
    startPolling(txId);
    }
