// ======================
// RUNWAY TEST STATE
// ======================

let STATE = {
  engine: "runwayml",
  mode: null
};

// ======================
// SELECT MODEL
// ======================

document.getElementById("runway-i2v")?.addEventListener("click", () => {

  STATE.mode = "image_to_video";

  console.log("RUNWAY MODEL SELECTED:", STATE);

});

// ======================
// GENERATE
// ======================

document.getElementById("generate-runway")?.addEventListener("click", async () => {

  if (!STATE.mode) {

    alert("เลือก runway model ก่อน");

    return;

  }

  try {

    const res = await fetch(
      "https://sn-design-api.onrender.com/render",
      {
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          engine: STATE.engine,
          mode: STATE.mode,
          prompt:"TEST RUNWAY"
        })
      }
    );

    const data = await res.json();

    console.log("RUNWAY RESULT:", data);

  } catch(err) {

    console.error(err);

  }

});
