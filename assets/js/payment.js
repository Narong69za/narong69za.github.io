/**
 * [payment.js] - SN ULTRA MASTER PAYMENT CONTROL
 * เชื่อมต่อ Stripe, PromptPay, SCB, TrueMoney และ Crypto
 */

document.addEventListener("DOMContentLoaded", () => {
    // ผูกเหตุการณ์คลิกที่ Card ทุกใบ
    document.querySelectorAll(".engine-card").forEach(card => {
        card.addEventListener("click", () => {
            const method = card.dataset.method;
            renderPaymentUI(method);
        });
    });
});

// --- [UI RENDERER] ---
function renderPaymentUI(method) {
    const box = document.getElementById("paymentBox");
    const status = document.getElementById("paymentStatus");
    let html = "";

    status.innerText = `STATUS: CONFIGURING ${method.toUpperCase()}...`;

    switch (method) {
        case "truemoney":
            html = `
                <div class="method-confirm-area">
                    <h3>🟠 TRUE MONEY WALLET</h3>
                    <p>กรอกลิ้งค์ซองของขวัญเพื่อรับเครดิตทันที</p>
                    <input type="text" id="tmn-link" placeholder="https://gift.truemoney.com/campaign/?v=..." class="engine-input">
                    <button class="engine-btn" onclick="topupTMN()">ยืนยันการเติมเงิน</button>
                </div>`;
            break;
        case "promptpay":
        case "scb":
            html = `
                <div class="method-confirm-area">
                    <h3>🟣 QR PAYMENT (DYNAMIC)</h3>
                    <p>ระบุจำนวนเงิน (บาท)</p>
                    <input type="number" id="pay-amount" placeholder="ระบุยอดเงิน (ขั้นต่ำ 20)" min="20" class="engine-input">
                    <div id="credit-preview" style="margin-top:5px; color:#6a1b9a; font-weight:bold;">คุณจะได้รับ: 0 Credits</div>
                    <button class="engine-btn" onclick="processQR('${method}')">สร้าง QR CODE</button>
                </div>`;
            break;
        case "stripe":
            html = `
                <div class="method-confirm-area">
                    <h3>🔵 STRIPE GLOBAL</h3>
                    <p>ชำระผ่านบัตรเครดิต/เดบิต (ความปลอดภัยสูง)</p>
                    <select id="stripe-package" class="engine-select">
                        <option value="100">100 บาท (1,050 Credits)</option>
                        <option value="300">300 บาท (3,600 Credits)</option>
                        <option value="500">500 บาท (5,750 Credits)</option>
                    </select>
                    <button class="engine-btn" onclick="processStripe()">ไปหน้าชำระเงิน</button>
                </div>`;
            break;
        case "crypto":
            html = `
                <div class="method-confirm-area">
                    <h3>🟡 CRYPTO GATEWAY</h3>
                    <p>ชำระด้วย USDT / BNB (Binance Rate)</p>
                    <input type="number" id="crypto-amount" placeholder="ระบุยอด USDT" class="engine-input">
                    <button class="engine-btn" onclick="processCrypto()">GET WALLET ADDRESS</button>
                </div>`;
            break;
    }

    box.innerHTML = html;

    // ระบบคำนวณเครดิต Preview (Option B: 1 THB = 10c)
    const amountInput = document.getElementById("pay-amount");
    if (amountInput) {
        amountInput.addEventListener("input", (e) => {
            const thb = e.target.value || 0;
            const credits = thb * 10; // BASE_RATE จาก policy
            document.getElementById("credit-preview").innerText = `คุณจะได้รับ: ${credits.toLocaleString()} Credits`;
        });
    }
}

// --- [ACTION FUNCTIONS] ---

// 1. TrueMoney
async function topupTMN() {
    const link = document.getElementById("tmn-link").value;
    if (!link.includes("gift.truemoney.com")) return alert("ลิ้งค์ซองไม่ถูกต้อง!");

    try {
        const res = await fetch("/api/truemoney/topup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ giftLink: link })
        });
        const data = await res.json();
        alert(data.message);
        if (data.success) location.reload();
    } catch (e) { alert("ระบบ TrueMoney ขัดข้อง"); }
}

// 2. QR Code (PromptPay / SCB)
async function processQR(method) {
    const amount = document.getElementById("pay-amount").value;
    if (amount < 20) return alert("ขั้นต่ำ 20 บาทครับพาร์ทเนอร์");

    try {
        const res = await fetch(`/api/${method}/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: amount })
        });
        const data = await res.json();

        if (data.qrImage) {
            document.getElementById("qrFrame").innerHTML = `<img src="${data.qrImage}" style="width:200px; height:200px;">`;
            document.getElementById("displayAmount").innerText = amount;
            document.getElementById("qrModal").style.display = "flex";
            
            // สร้างปุ่มดาวน์โหลด
            document.getElementById("downloadContainer").innerHTML = 
                `<a href="${data.qrImage}" download="SN_PAYMENT_QR.png" class="download-qr-btn">บันทึกรูป QR</a>`;

            startPolling(data.transactionId);
        }
    } catch (e) { alert("ไม่สามารถสร้าง QR ได้"); }
}

// 3. Stripe
async function processStripe() {
    const amount = document.getElementById("stripe-package").value;
    const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountTHB: amount })
    });
    const session = await res.json();
    if (session.url) window.location.href = session.url;
}

// --- [UTILITIES] ---

function startPolling(txId) {
    const timer = setInterval(async () => {
        const res = await fetch(`/api/payment/status?txId=${txId}`);
        const data = await res.json();

        if (data.status === "paid" || data.status === "success") {
            clearInterval(timer);
            alert("ยินดีด้วย! เครดิตถูกเพิ่มเข้าบัญชีเรียบร้อย");
            location.reload();
        }
    }, 4000); // เช็คทุก 4 วินาที

    // ปิด Modal เมื่อกดปุ่ม
    document.getElementById("closeQr").onclick = () => {
        clearInterval(timer);
        document.getElementById("qrModal").style.display = "none";
    };
                       }
                              
