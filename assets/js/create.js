// ======================================================
// SN DESIGN AI ENGINE
// CREATE PAGE CORE
// ======================================================

const API = "/api";

const statusEl = document.getElementById("status");
const emailEl = document.getElementById("userEmail");
const creditEl = document.getElementById("userCredits");

const promptInput = document.getElementById("prompt");

let CURRENT_USER = null;


// ======================================================
// LOAD USER STATE
// ======================================================

async function loadUserState(){

   const userId = localStorage.getItem("userId");

   if(!userId){

      emailEl.innerText = "Guest";
      creditEl.innerText = "Free Mode";

      CURRENT_USER = null;
      return;

   }

   try{

      const res = await fetch(API+"/user/profile?userId="+userId);
      const data = await res.json();

      CURRENT_USER = data;

      emailEl.innerText = data.email || userId;
      creditEl.innerText = data.credits+" Credits";

   }catch(err){

      console.log("LOAD USER FAIL",err);

      emailEl.innerText = "Guest";
      creditEl.innerText = "-";

   }

}


// ======================================================
// MODEL SELECT
// ======================================================

let selectedAlias = null;

document.querySelectorAll(".model-btn").forEach(btn=>{

   btn.addEventListener("click",()=>{

      document.querySelectorAll(".model-btn")
      .forEach(b=>b.classList.remove("active"));

      btn.classList.add("active");

      selectedAlias = btn.dataset.alias;

   });

});


// ======================================================
// GENERATE
// ======================================================

document.querySelectorAll(".generate-btn").forEach(btn=>{

   btn.addEventListener("click", async ()=>{

      if(!CURRENT_USER){

         alert("ยังไม่ได้ Login Google");
         return;

      }

      if(!selectedAlias){

         alert("เลือกโหมดก่อน");
         return;

      }

      const prompt = promptInput.value.trim();

      if(!prompt){

         alert("ใส่ prompt");
         return;

      }

      statusEl.innerText = "STATUS: PROCESSING...";

      try{

         const form = new FormData();

         form.append("prompt",prompt);
         form.append("alias",selectedAlias);
         form.append("userId",CURRENT_USER.id);

         const fileA = document.getElementById("fileA").files[0];
         const fileB = document.getElementById("fileB").files[0];

         if(fileA) form.append("fileA",fileA);
         if(fileB) form.append("fileB",fileB);

         const res = await fetch(API+"/render",{
            method:"POST",
            body:form
         });

         const data = await res.json();

         console.log("RENDER RESULT",data);

         statusEl.innerText = "STATUS: DONE";

      }catch(err){
