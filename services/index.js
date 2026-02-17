const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/* =========================
ROOT PATH
========================= */

const ROOT = path.join(__dirname,"..");

/* =========================
STATIC FILES (คืนหน้าเว็บทั้งหมด)
========================= */

app.use(express.static(ROOT));

/* =========================
HOME
========================= */

app.get("/",(req,res)=>{
   res.sendFile(path.join(ROOT,"index.html"));
});

/* =========================
AUTO HTML ROUTER (ทุกหน้า)
templates
create
services
seo
contact
packages
========================= */

app.get(/^\/(?!api).*/, (req,res,next)=>{

   let requestPath=req.path;

   if(!requestPath.includes(".")){
      requestPath += ".html";
   }

   const filePath = path.join(ROOT,requestPath);

   res.sendFile(filePath,(err)=>{
      if(err){
         res.status(404).send("PAGE NOT FOUND");
      }
   });

});

/* =========================
SERVER START
========================= */

const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{
   console.log("ULTRA FRONT RESTORED:",PORT);
});
