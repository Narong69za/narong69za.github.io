// ======================
// STATE
// ======================

let STATE = {
  engine: "runwayml",
  mode: null
};

// ======================
// SELECT MODE (mode-btn)
// ======================

document.querySelectorAll(".mode-btn").forEach(btn => {

  btn.addEventListener("click", () => {

    // ลบ active เดิม
    document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));

    btn.classList.add("active");

    STATE.mode = btn.dataset.mode;

    console.log("MODE SELECTED:", STATE.mode);

  });

});

// ======================
// GENERATE RED
// ======================

document.getElementById("generate-red")?.addEventListener("click", async () => {

  await runRender("red");

});

// ======================
// GENERATE BLUE
// ======================

document.getElementById("generate-blue")?.addEventListener("click", async () => {

  await runRender("blue");

});

// ======================
// RUN RENDER
// ======================

async function runRender(side){

  if (!STATE.mode) {

    alert("เลือก Model ก่อน");

    return;

  }

  const prompt = document.getElementById("prompt")?.value || "";

  const fileInput = document.getElementById("fileA");

  const formData = new FormData();

  formData.append("engine", STATE.engine);
  formData.append("mode", STATE.mode);
  formData.append("prompt", prompt);

  if (fileInput?.files[0]) {
    formData.append("fileA", fileInput.files[0]);
  }

  try {

    document.getElementById("status").innerText = "STATUS: PROCESSING";

    const res = await fetch(
      "https://sn-design-api.onrender.com/render",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await res.json();

    console.log("RENDER RESPONSE:", data);

    if (data.status === "processing") {
      document.getElementById("status").innerText = "STATUS: QUEUED";
    } else {
      document.getElementById("status").innerText = "STATUS: ERROR";
    }

  } catch (err) {

    console.error(err);

    document.getElementById("status").innerText = "STATUS: ERROR";

  }

}
