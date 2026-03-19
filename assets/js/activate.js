/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: ACTIVATE CLIENT ENGINE (FULL VERSION)
 * VERSION: 2.0.0
 * STATUS: PRODUCTION READY
 * =====================================================
 * FEATURES:
 * - Bind HWID
 * - Activate License
 * - Auto Generate QR
 * - Render QR Image
 * - Debug Log
 * =====================================================
 */

const API_ACTIVATE = "https://vagally-transequatorial-frederic.ngrok-free.dev/api/activate";
const API_QR = "https://vagally-transequatorial-frederic.ngrok-free.dev/qr/payment/create";
/*============================
   GET PARAMS
============================= */
function getParams() {
  const p = new URLSearchParams(window.location.search);
  return {
    user: p.get("user") || "guest",
    hwid: p.get("hwid") || navigator.userAgent.slice(0, 16),
    amount: parseInt(p.get("amount") || "0")
  };
}

/* =============================
   INIT HWID
============================= */
function bindHWID() {
  const hwidInput = document.getElementById("hwid");
  if (!hwidInput) return;

  const { hwid } = getParams();
  hwidInput.value = hwid;

  console.log("[HWID]", hwid);
}

/* =============================
   ACTIVATE KEY
============================= */
async function activateKey() {

  const key = document.getElementById("activate-key").value;
  if (!key) {
    alert("กรุณาใส่ Activation Key");
    return;
  }

  try {

    const res = await fetch(API_ACTIVATE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: key,
        device_id: getParams().hwid
      })
    });

    const data = await res.json();

    console.log("[ACTIVATE RESPONSE]", data);

    switch (data.status) {

      case "ok":
        alert("เปิดใช้งานสำเร็จ");
        window.location.href = "/create.html";
        break;

      case "invalid_key":
        alert("Key ไม่ถูกต้อง");
        break;

      case "expired":
        alert("Key หมดอายุ");
        break;

      case "device_locked":
        alert("Key ถูกใช้กับเครื่องอื่น");
        break;

      default:
        alert("Activation Failed");
    }

  } catch (err) {
    console.error("[ACTIVATE ERROR]", err);
    alert("API ERROR");
  }
}

/* =============================
   GENERATE QR
============================= */
async function generateQR() {

  const { user, amount } = getParams();

  const container = document.getElementById("qr-container");

  if (!container) {
    console.warn("NO qr-container");
    return;
  }

  if (!amount || amount <= 0) {
    container.innerHTML = "<p>ไม่พบจำนวนเงิน</p>";
    return;
  }

  container.innerHTML = "<p>กำลังสร้าง QR...</p>";

  try {

    console.log("[QR REQUEST]", user, amount);

    const res = await fetch(API_QR, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        order_id: user + "_" + Date.now(),
        amount: amount
      })
    });

    const data = await res.json();

    console.log("[QR RESPONSE]", data);

    if (data.qr_image) {

      container.innerHTML = `
        <img src="${data.qr_image}" width="260"/>
        <p>สแกนเพื่อชำระเงิน</p>
      `;

    } else {

      container.innerHTML = "<p>QR สร้างไม่สำเร็จ</p>";

    }

  } catch (err) {

    console.error("[QR ERROR]", err);

    container.innerHTML = "<p>API ERROR</p>";
  }
}

/* =============================
   COPY KEY
============================= */
function copyKey() {
  const key = document.getElementById("generated-key");
  if (!key) return;

  navigator.clipboard.writeText(key.value);
  alert("คัดลอกแล้ว");
}

/* =============================
   INIT
============================= */
window.addEventListener("load", () => {

  console.log("=== ACTIVATE ENGINE START ===");

  bindHWID();
  generateQR();

});
