const API_BASE = "https://api.sn-designstudio.dev";

async function setMethod(method) {
    const amount = prompt("ระบุจำนวนเงินที่ต้องการเติม (ขั้นต่ำ 10):", "10");
    if (!amount || amount < 10) return;

    let endpoint = "";
    if (method === "promptpay") endpoint = "/api/scb/create-qr";
    else if (method === "truemoney") endpoint = "/api/truemoney/create-link";
    else if (method === "stripe") endpoint = "/api/stripe/create-checkout";
    else if (method === "crypto") endpoint = "/api/crypto/create-order";

    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: parseInt(amount) })
        });
        const data = await res.json();
        if (data.qrImage) {
            document.getElementById("qrFrame").innerHTML = `<img src="${data.qrImage}" class="mx-auto">`;
            document.getElementById("qrModal").style.display = "flex";
        } else if (data.url || data.paymentUrl) {
            window.location.href = data.url || data.paymentUrl;
        }
    } catch (e) {
        alert("เชื่อมต่อ API ล้มเหลว ตรวจสอบพอร์ต 5002");
    }
}

document.querySelectorAll("[data-method]").forEach(el => {
    el.onclick = () => setMethod(el.dataset.method);
});
