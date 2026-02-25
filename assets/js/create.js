// =======================================================
// ULTRA ENGINE CONTROL
// FULL RUNWAY PRODUCTION VERSION
// RED ENGINE = RUNWAYML
// BLUE ENGINE = RESERVED
// =======================================================


// ======================
// STATE
// ======================

let STATE = {
  engine: null,
  alias: "image_to_video",
  type: "video"
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

const promptInput = document.querySelector("textarea");

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

    if (!fileA?.files[0]) {
      alert("กรุณาเลือกไฟล์ IMPORT FILE A ก่อน");
      return;
    }

    STATE.engine = "runwayml";

    setStatus("SENDING RUNWAY REQUEST...");

    const formData = new FormData();

    formData.append("engine", STATE.engine);
    formData.append("alias", STATE.alias);
    formData.append("type", STATE.type);
    formData.append("prompt", promptInput?.value || "SN DESIGN RUNWAY");

    formData.append("fileA", fileA.files[0]);

    if (fileB?.files[0]) {
      formData.append("fileB", fileB.files[0]);
    }

    const res = await fetch(
      "https://sn-design-api.onrender.com/api/render",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await res.json();

    console.log("RUNWAY RESPONSE:", data);

    if (data?.status === "queued") {
      setStatus("QUEUED");
    } else {
      setStatus("ERROR");
    }

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
