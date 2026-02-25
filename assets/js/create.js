// =======================================================
// ULTRA ENGINE CONTROL
// FULL RUNWAY PRODUCTION VERSION
// =======================================================

let STATE = {
  engine: null,
  mode: "image_to_video"
};

const statusEl = document.getElementById("status");

const fileA = document.getElementById("fileA");
const fileB = document.getElementById("fileB");

const previewRedVideo = document.getElementById("preview-red-video");
const previewRedImage = document.getElementById("preview-red-image");

const previewBlueVideo = document.getElementById("preview-blue-video");
const previewBlueImage = document.getElementById("preview-blue-image");

const generateButtons = document.querySelectorAll(".generate-btn");

function setStatus(text){
  if(statusEl){
    statusEl.innerText = "STATUS: " + text;
  }
}

// ======================
// PREVIEW
// ======================

fileA?.addEventListener("change",()=>{
  const file = fileA.files[0];
  if(!file) return;

  const url = URL.createObjectURL(file);

  if(file.type.startsWith("video")){
    previewRedVideo.src = url;
    previewRedVideo.style.display="block";
    previewRedImage.style.display="none";
  }

  if(file.type.startsWith("image")){
    previewRedImage.src = url;
    previewRedImage.style.display="block";
    previewRedVideo.style.display="none";
  }
});

fileB?.addEventListener("change",()=>{
  const file = fileB.files[0];
  if(!file) return;

  const url = URL.createObjectURL(file);

  if(file.type.startsWith("video")){
    previewBlueVideo.src = url;
    previewBlueVideo.style.display="block";
    previewBlueImage.style.display="none";
  }

  if(file.type.startsWith("image")){
    previewBlueImage.src = url;
    previewBlueImage.style.display="block";
    previewBlueVideo.style.display="none";
  }
});


// ======================
// ENGINE
// ======================

const redGenerateBtn = generateButtons[0];

redGenerateBtn?.addEventListener("click", async ()=>{

  try{

    STATE.engine="runwayml";

    setStatus("SENDING RUNWAY REQUEST...");

    // ⭐ จำลอง user login ก่อน (temporary)
    const userId = localStorage.getItem("USER_ID") || "dev-test-user";

    const res = await fetch(
      "https://sn-design-api.onrender.com/api/render",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "x-user-id": userId
        },
        body: JSON.stringify({
          engine:"runwayml",
          alias:"image_to_video",
          type:"video",
          prompt:"DEV RUNWAY TEST"
        })
      }
    );

    const data = await res.json();

    console.log(data);

    setStatus("SUCCESS");

  }catch(err){

    console.error(err);

    setStatus("ERROR");

  }

});
