const API_BASE = "https://api.sn-designstudio.dev";

async function setMethod(method) {
    const amount = prompt("จำนวนเงิน (ขั้นต่ำ 10):", "10");
    if (!amount || amount < 10) return;

    let path = (method === "promptpay") ? "/api/scb/create-qr" : "/api/truemoney/create-link";
    
    try {
        const res = await fetch(`${API_BASE}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: parseInt(amount) })
        });
        const data = await res.json();
        if (data.qrImage) {
            document.getElementById("qrFrame").innerHTML = `<img src="${data.qrImage}" class="mx-auto">`;
            document.getElementById("qrModal").style.display = "flex";
        } else if (data.url) {
            window.location.href = data.url;
        }
    } catch (e) {
        alert("ติดต่อ API ไม่ได้: เช็ค Port 5002");
    }
}
