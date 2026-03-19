/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: ACTIVATE CLIENT ENGINE
 * VERSION: 2.0.0 (CLEAN BUILD)
 * STATUS: PRODUCTION READY
 * =====================================================
 */

const API_ENDPOINT = "/api/activate";

/* =========================
   UTILS
========================= */

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    user: params.get("user"),
    hwid: params.get("hwid"),
    amount: params.get("amount")
  };
}

function setStatus(text) {
  const el = document.getElementById("qr-status");
  if (el) el.innerText = text;
}

/* =========================
   ACTIVATE KEY
========================= */

async function activateKey() {

  const key = document.getElementById("activate-key").value;

  if (!key) {
    alert("กรุณาใส่ Activation Key");
    return;
  }

  try {

    const res = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        key: key,
        device_id: getQueryParams().hwid || navigator.userAgent
      })
    });

    const data = await res.json();

    switch (data.status) {

      case "ok":
        alert("ระบบเปิดใช้งานสำเร็จ");
        window.location.href = "/create.html";
        break;

      case "invalid_key":
        alert("Key ไม่ถูกต้อง");
        break;

      case "expired":
        alert("Key หมดอายุ");
        break;

      case "device_locked":
        alert("Key ถูกใช้งานกับเครื่องอื่น");
        break;

      default:
        alert("Activation Failed");

    }

  } catch (err) {
    console.error(err);
    alert("API ERROR");
  }
}

/* =========================
   COPY KEY
========================= */

function copyKey() {

  const key = document.getElementById("generated-key");

  if (!key || !key.value) {
    alert("ไม่มี Key ให้คัดลอก");
    return;
  }

  navigator.clipboard.writeText(key.value);
  alert("คัดลอก Key แล้ว");
}

/* =========================
   GENERATE QR (CORE FIX)
========================= */

async function generateQR() {

  const { user, amount } = getQueryParams();

  if (!amount) {
    console.warn("NO AMOUNT");
    return;
  }

  const container = document.getElementById("qr-container");

  if (!container) return;

  setStatus("กำลังสร้าง QR...");

  try {

    const res = await fetch("/qr/payment/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        order_id: (user || "guest") + "_" + Date.now(),
        amount: parseInt(amount)
      })
    });

    const data = await res.json();

    console.log("QR RESPONSE:", data);

    // 🔥 FIX สำคัญ: ใช้ qr_image ไม่ใช่ qrImage
    if (data.qr_image) {

      container.innerHTML = `
        <img src="${data.qr_image}" width="240"/>
        <p>สแกนเพื่อชำระเงิน</p>
      `;

      setStatus("รอการชำระเงิน");

    } else {

      container.innerHTML = `<p>QR GENERATE FAILED</p>`;
      setStatus("ERROR");

    }

  } catch (err) {

    console.error("QR ERROR", err);

    container.innerHTML = `<p>QR ERROR</p>`;
    setStatus("ERROR");

  }

}

/* =========================
   INIT
========================= */

window.addEventListener("load", () => {

  // AUTO GENERATE QR
  generateQR();

});
