// =======================================================
// ULTRA ENGINE CONTROL
// FULL RUNWAY TEST VERSION
// RED ENGINE = RUNWAYML
// BLUE ENGINE = RESERVED (ยังไม่ใช้)
// =======================================================


// ======================
// STATE
// ======================

let STATE = {
  engine: null,
  mode: "image_to_video"
};


// ======================
// DOM
// ======================

const statusEl = document.getElementById("status");

const fileA = document.getElementById("fileA");
const fileB = document.getElementById("fileB");

const previewRedVideo = document.getElementById("preview-red-video");
const previewRedImage = document.getElementById("preview-red-image");

const previewBlueVideo = document.getElementById("preview-blue-video");
const previewBlueImage = document.getElementById("preview-blue-image");

const generateButtons = document.querySelectorAll(".generate-btn");


// ======================
// STATUS
// ======================

function setStatus(text) {
  if (statusEl) {
    statusEl.innerText = "STATUS: " + text;
  }
}


// ======================
// PREVIEW SYSTEM
// ======================

fileA?.addEventListener("change", () => {

  const file = fileA.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);

  if (file.type.startsWith("video")) {
    previewRedVideo.src = url;
    previewRedVideo.style.display = "block";
    previewRedImage.style.display = "none";
  }

  if (file.type.startsWith("image")) {
    previewRedImage.src = url;
    previewRedImage.style.display = "block";
    previewRedVideo.style.display = "none";
  }

});


fileB?.addEventListener("change", () => {

  const file = fileB.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);

  if (file.type.startsWith("video")) {
    previewBlueVideo.src = url;
    previewBlueVideo.style.display = "block";
    previewBlueImage.style.display = "none";
  }

  if (file.type.startsWith("image")) {
    previewBlueImage.src = url;
    previewBlueImage.style.display = "block";
    previewBlueVideo.style.display = "none";
  }

});


// ======================
// ENGINE SELECT
// ======================

const redGenerateBtn = generateButtons[0];
const blueGenerateBtn = generateButtons[1];


// ======================
// RED ENGINE → RUNWAYML
// ======================

redGenerateBtn?.addEventListener("click", async () => {

  try {

    STATE.engine = "runwayml";

    setStatus("SENDING RUNWAY REQUEST...");

    const res = await fetch(
"https://sn-design-api.onrender.com/api/render",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          engine: STATE.engine,
          mode: STATE.mode,
          prompt: "DEV RUNWAY TEST"
        })
      }
    );

    const data = await res.json();

    console.log("RUNWAY RESPONSE:", data);

    setStatus("SUCCESS");

  } catch (err) {

    console.error(err);

    setStatus("ERROR");

  }

});


// ======================
// BLUE ENGINE (DISABLED)
// ======================

blueGenerateBtn?.addEventListener("click", () => {

  alert("BLUE ENGINE ยังไม่เปิด (Replicate ยังไม่ bind)");

});
