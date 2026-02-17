/* ======================================
ULTRA ONE FILE FINAL SERVER
SN DESIGN STUDIO
====================================== */

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());

/* ======================================
STATIC FILES (css js images html)
====================================== */

app.use(express.static(__dirname));

/* ======================================
ULTRA API RENDER (DIRECT MODE)
====================================== */

app.post("/api/render", async (req,res)=>{

   console.log("🔥 CREATE CLICKED");

   try{

      // จำลอง AI render ก่อน (กัน error)
      const result = {
         status:"success",
         message:"Render started",
         time: Date.now()
      };

      res.json(result);

   }catch(e){

      console.log(e);
      res.status(500).json({error:"render failed"});

   }

});

/* ======================================
ULTRA AUTO HTML ENGINE
ไม่ต้องแก้ html ทีละไฟล์อีก
====================================== */

app.get("/*.html",(req,res)=>{

   const filePath = path.join(__dirname,req.path);

   if(!fs.existsSync(filePath)){

      return res.status(404).send("Not found");

   }

   let html = fs.readFileSync(filePath,"utf8");

   /* inject ultra-core */

   if(!html.includes("ultra-core.js")){

      html = html.replace(
         "</body>",
         `<script src="/assets/js/ultra-core.js"></script></body>`
      );

   }

   res.send(html);

});

/* ======================================
ROOT HOME
====================================== */

app.get("/",(req,res)=>{

   res.sendFile(path.join(__dirname,"index.html"));

});

/* ======================================
START SERVER
====================================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{

   console.log("🔥 SN DESIGN ULTRA SERVER ONLINE 🔥");

});
