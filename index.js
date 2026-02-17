const express = require("express");
const path = require("path");

const app = express();

/* =====================================
ULTRA STATIC WEBSITE CORE
Serve HTML website จริง
===================================== */

app.use(express.static(__dirname));


/* =====================================
ULTRA API ROUTER
(API endpoint ต้องอยู่หลัง static)
===================================== */

app.use(express.json());

/* TEST API */

app.get("/api/status/server",(req,res)=>{
    res.json({
        server:"online",
        time:Date.now()
    });
});


/* =====================================
ULTRA AUTO INJECT ENGINE
ไม่ต้องแก้ HTML ทีละหน้า
===================================== */

const fs = require("fs");

app.get("/*.html",(req,res)=>{

    const filePath = path.join(__dirname, req.path);

    if(!fs.existsSync(filePath)){
        return res.status(404).send("Not found");
    }

    let html = fs.readFileSync(filePath,"utf8");

    if(!html.includes("ultra-core.js")){
        html = html.replace(
            "</body>",
            `<script src="/assets/js/ultra-core.js"></script></body>`
        );
    }

    res.send(html);
});


/* =====================================
ULTRA SERVER START
===================================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log("SN DESIGN SERVER RUNNING ON PORT "+PORT);
});
