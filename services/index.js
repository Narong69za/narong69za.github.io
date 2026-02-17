// ======================================
// SN DESIGN STUDIO — ULTRA FINAL ROUTER
// ======================================

const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/* ======================================
ROOT PATH (สำคัญ)
====================================== */

const ROOT = path.join(__dirname, ".."); // ย้อนออกจาก services

/* ======================================
STATIC FILES
====================================== */

app.use("/assets", express.static(path.join(ROOT,"assets")));
app.use(express.static(ROOT));

/* ======================================
ROOT INDEX
====================================== */

app.get("/", (req,res)=>{
   res.sendFile(path.join(ROOT,"index.html"));
});

/* ======================================
ULTRA AUTO HTML ROUTER
====================================== */

app.get(/^\/(?!api).*/, (req,res,next)=>{

   let requestPath = req.path;

   if(!requestPath.includes(".")){
      requestPath = requestPath + ".html";
   }

   const filePath = path.join(ROOT, requestPath);

   res.sendFile(filePath,(err)=>{
      if(err){
         next();
      }
   });

});

/* ======================================
SERVER START
====================================== */

const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{
   console.log("🔥 SN DESIGN ULTRA ROUTER READY:",PORT);
});
