/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: ACTIVATE CLIENT ENGINE
 * VERSION: 1.2.0
 * STATUS: ACTIVE
 * PURPOSE: Bind HWID + Activate key
 * =====================================================
 */

const API_ENDPOINT = "/api/activate";

function getHWID() {
  const params = new URLSearchParams(window.location.search);
  const hwid = params.get("hwid");
  return hwid || navigator.userAgent.slice(0, 10);
}

window.addEventListener("load", () => {
  const hwidInput = document.getElementById("hwid");
  if (hwidInput) hwidInput.value = getHWID();
});

async function activateKey() {
  const key = document.getElementById("activate-key").value;
  if (!key) return alert("กรุณาใส่ Activation Key");

  try {
    const res = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, device_id: getHWID() })
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

function copyKey() {
  const key = document.getElementById("generated-key");
  navigator.clipboard.writeText(key.value);
  alert("คัดลอก Key แล้ว");
}
