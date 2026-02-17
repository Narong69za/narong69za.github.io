require("dotenv").config();

const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json());

/* ======================================================
SN DESIGN GLOBAL MEMORY ENGINE
====================================================== */

global.SN_QUEUE = new Map();
global.SN_ONLINE_USERS = new Set();

/* ======================================================
ULTRA AUTO INJECT ENGINE
AUTO ADD ultra-core.js EVERY HTML
NO NEED EDIT HTML AGAIN
====================================================== */

app.get("/*.html", (req,res)=>{

   const filePath = path.join(__dirname, req.path);

   if(!fs.existsSync(filePath)){
      return res.status(404).send("Not found");
   }

   let html = fs.readFileSync(filePath,"utf8");

   // AUTO inject core system
   if(!html.includes("ultra-core.js")){

      html = html.replace(
         "</body>",
         `
<script src="/assets/js/ultra-core.js"></script>
</body>`
      );

   }

   res.send(html);

});

/* ======================================================
STATIC FILES
serve assets AFTER inject handler
====================================================== */

app.use(express.static(__dirname));

/* ======================================================
ROOT INDEX
====================================================== */

app.get("/", (req,res)=>{
   res.sendFile(path.join(__dirname,"index.html"));
});

/* ======================================================
API ROUTES
====================================================== */

app.use("/api", require("./api/api.route"));

/* ======================================================
ULTRA LIVE STATUS API
====================================================== */

app.get("/api/status",(req,res)=>{

   res.json({

      server:true,
      ai:true,
      onlineUsers: global.SN_ONLINE_USERS.size

   });

});

/* ======================================================
ONLINE USER TRACKING (ULTRA SIMPLE)
====================================================== */

app.use((req,res,next)=>{

   const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress;

   if(ip){
      global.SN_ONLINE_USERS.add(ip);
   }

   next();

});

/* ======================================================
SERVER START
====================================================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{

   console.log("🔥 SN DESIGN ULTRA SERVER READY:",PORT);

});
