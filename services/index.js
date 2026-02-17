// ======================================
// SN DESIGN STUDIO — ULTRA FINAL ROUTER
// ======================================

const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/* ======================================
STATIC FILES (สำคัญ ต้องอยู่บนสุด)
====================================== */

app.use("/assets", express.static(path.join(__dirname,"assets")));
app.use(express.static(__dirname));

/* ======================================
ROOT INDEX
====================================== */

app.get("/", (req,res)=>{
   res.sendFile(path.join(__dirname,"index.html"));
});

/* ======================================
ULTRA AUTO HTML ROUTER (ตัวเดียวพอ)
====================================== */

app.get(/^\/(?!api).*/, (req,res,next)=>{

   let requestPath = req.path;

   if(!requestPath.includes(".")){
      requestPath = requestPath + ".html";
   }

   const filePath = path.join(__dirname,
