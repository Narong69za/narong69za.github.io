// ======================================
// SN DESIGN STUDIO — ULTRA FINAL ROUTER
// ======================================

const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/* ======================================
STATIC WEBSITE ROOT
====================================== */

app.use(express.static(__dirname));

/* ======================================
ROOT INDEX
====================================== */

app.get("/", (req,res)=>{
   res.sendFile(path.join(__dirname,"index.html"));
});

/* ======================================
ULTRA AUTO HTML ROUTER
ไม่ต้องเขียน route ทีละหน้าอีก
====================================== */

app.get("*",(req,res,next)=>{

   let requestPath = req.path;

   // ถ้าไม่มี .html → เติม .html ให้อัตโนมัติ
   if(!requestPath.includes(".")){
      requestPath = requestPath + ".html";
   }

   const filePath = path.join(__dirname, requestPath);

   res.sendFile(filePath,(err)=>{
      if(err){
         next(); // ถ้าไม่มีไฟล์ → ไป middleware ต่อ
      }
   });

});

/* ======================================
SERVER START
====================================== */

const PORT = process.env.PORT || 10000;
// ==============================
// ROUTER FIX
// ==============================

app.use("/assets", express.static(path.join(__dirname,"assets")));

app.get(/^\/(?!api).*/, (req,res,next)=>{

   let requestPath = req.path;

   if(requestPath === "/"){
      return res.sendFile(path.join(__dirname,"index.html"));
   }

   if(!requestPath.includes(".")){
      requestPath = requestPath + ".html";
   }

   const filePath = path.join(__dirname, requestPath);

   res.sendFile(filePath,(err)=>{
      if(err){
         next();
      }
   });

});
app.listen(PORT,()=>{
   console.log("🔥 SN DESIGN ULTRA ROUTER READY:",PORT);
});
