const express = require("express");
const path = require("path");

const app = express();

/* ======================================
CORS (มือถือ / cross domain)
====================================== */

app.use((req,res,next)=>{
   res.header("Access-Control-Allow-Origin","*");
   res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
   res.header("Access-Control-Allow-Methods","GET,POST,OPTIONS");
   next();
});

app.use(express.json());

/* ======================================
ROOT PATH
====================================== */

const ROOT = path.join(__dirname,"..");

/* ======================================
STATIC FILES
====================================== */

app.use("/assets", express.static(path.join(ROOT,"assets")));
app.use(express.static(ROOT));

/* ======================================
RENDER JOB ENGINE
====================================== */

let jobs = {};

/* CREATE RENDER */

app.post("/api/render",(req,res)=>{

   const jobID = Date.now().toString();

   jobs[jobID]={
      status:"queued",
      progress:0
   };

   simulateRender(jobID);

   console.log("RENDER START:",jobID);

   res.json({ jobID });

});

/* STATUS CHECK */

app.get("/api/status",(req,res)=>{

   const id=req.query.id;

   if(!jobs[id]){
      return res.status(404).json({error:"not found"});
   }

   res.json(jobs[id]);

});

/* SIMULATE ENGINE */

function simulateRender(id){

   let progress=0;

   jobs[id].status="processing";

   const interval=setInterval(()=>{

      progress+=10;

      jobs[id].progress=progress;

      if(progress>=100){

         jobs[id].status="complete";

         clearInterval(interval);

         console.log("RENDER COMPLETE:",id);

      }

   },2000);

}

/* ======================================
ROOT INDEX
====================================== */

app.get("/",(req,res)=>{
   res.sendFile(path.join(ROOT,"index.html"));
});

/* ======================================
ULTRA AUTO HTML ROUTER
====================================== */

app.get(/^\/(?!api).*/, (req,res,next)=>{

   let requestPath=req.path;

   if(!requestPath.includes(".")){
      requestPath += ".html";
   }

   const filePath=path.join(ROOT,requestPath);

   res.sendFile(filePath,(err)=>{
      if(err) next();
   });

});

/* ======================================
START SERVER
====================================== */

const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{
   console.log("🔥 ULTRA ENGINE RUNNING:",PORT);
});
