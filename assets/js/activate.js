/**
 * =====================================================
 * SN DESIGN - ACTIVATE ENGINE (FINAL STABLE)
 * =====================================================
 */

const API_BASE = "https://vagally-transequatorial-frederic.ngrok-free.dev";

const API_ACTIVATE = API_BASE + "/api/activate";
const API_QR = API_BASE + "/qr/payment/create";

/* =============================
   PARAMS
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
   BIND HWID
============================= */
function bindHWID() {
  const input = document.getElementById("hwid");
  if (!input) return;

  const { hwid } = getParams();
  input.value = hwid;

  console.log("[HWID]", hwid);
}

/* =============================
   SHOW USER
============================= */
function showUser() {
  const el = document.getElementById("user-info");
  if (!el) return;

  const { user } = getParams();
  el.innerText = "User: " + user;
}

/* =============================
   ACTIVATE
============================= */
async function activateKey() {

  const key = document.getElementById("activate-key")?.value;

  if (!key) return alert("กรุณาใส่ Activation Key");

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

    console.log("[ACTIVATE]", data);

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
    console.error(err);
    alert("API ERROR");
  }
}

/* =============================
   GENERATE QR
============================= */
async function generateQR() {

  const { user, amount } = getParams();
  const box = document.getElementById("qr-container");

  if (!box) return;

  if (!amount) {
    box.innerHTML = "<p>ไม่พบจำนวนเงิน</p>";
    return;
  }

  box.innerHTML = "<p>กำลังสร้าง QR...</p>";

  try {

    console.log("[QR CALL]", user, amount);

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

      box.innerHTML = `
        <img src="${data.qr_image}" width="260"/>
        <p>สแกนเพื่อชำระเงิน</p>
      `;

    } else {
      box.innerHTML = "<p>QR ไม่สำเร็จ</p>";
    }

  } catch (err) {
    console.error(err);
    box.innerHTML = "<p>API ERROR</p>";
  }
}

/* =============================
   COPY
============================= */
function copyKey() {
  const el = document.getElementById("generated-key");
  if (!el) return;

  navigator.clipboard.writeText(el.value);
  alert("คัดลอกแล้ว");
}

/* =============================
   INIT (สำคัญสุด)
============================= */
window.addEventListener("DOMContentLoaded", () => {

  console.log("=== ACTIVATE ENGINE START ===");

  bindHWID();
  showUser();
  generateQR();   // 🔥 ตรงนี้แหละ trigger QR จริง

});
