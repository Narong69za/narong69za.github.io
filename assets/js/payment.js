/**
 * [payment.js] - FULL ACCESS
 * เชื่อมต่อ Stripe, PromptPay, SCB และ TrueMoney
 */

// 1. ระบบ Stripe (บัตรเครดิต) - เปิดทันที!
async function checkoutStripe(amount) {
    const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount }),
        credentials: "include"
    });
    const session = await response.json();
    if (session.url) window.location.href = session.url;
}

// 2. ระบบ True Money (Gift Link/Serial) - เปิดทันที!
async function topupTMN() {
    const tmnLink = document.getElementById("tmn-link").value;
    const response = await fetch("/api/truemoney", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link: tmnLink }),
        credentials: "include"
    });
    const result = await response.json();
    alert(result.message);
}

// 3. ระบบ PromptPay/SCB QR
async function generateQR(amount, method) {
    // method: 'promptpay' หรือ 'scb'
    const response = await fetch(`/api/${method}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount }),
        credentials: "include"
    });
    const data = await response.json();
    if (data.qrImage) {
        document.getElementById("qr-display").src = data.qrImage;
        // เริ่ม Polling เช็คยอดโอน...
    }
}
