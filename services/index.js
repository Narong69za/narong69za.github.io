// ======================================
// SN DESIGN STUDIO — ULTRA FINAL ROUTER
// ======================================

const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/* ======================================
ROOT PATH
====================================== */

const ROOT = path.join(__dirname, ".."); // ออกจาก services

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
API ROUTES
====================================== */

app.post("/api/render",(req,res)=>{

   console.log("RENDER REQUEST OK");

   res.json({
      status:"ok"
   });

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
