const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

const ROOT = path.join(__dirname,"..");

/* =============================
STATIC
============================= */

app.use("/assets", express.static(path.join(ROOT,"assets")));
app.use(express.static(ROOT));

/* =============================
ULTRA ENGINE STATE
============================= */

let jobs = {};
let queue = [];
let processing = false;

/* =============================
HELPERS
============================= */

function getIP(req){
   return (
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "unknown"
   ).toString().split(",")[0];
}

/* =============================
CREATE JOB (FINAL)
============================= */

app.post("/api/render",(req,res)=>{

   const payload = req.body || {};

   const jobID = Date.now().toString();

   jobs[jobID] = {

      id: jobID,

      ip: getIP(req),

      status:"queued",
      progress:0,

      createdAt: Date.now(),

      meta:{

         template: payload.template || "unknown",
         model: payload.model || "default",
         platform: payload.platform || "unknown",

         duration: payload.duration || 0,
         resolution: payload.resolution || "auto",

         assets: payload.assets || {},
         settings: payload.settings || {}

      }

   };

   queue.push(jobID);

   console.log("NEW JOB:", jobs[jobID]);

   startWorker();

   res.json({
      jobID,
      meta: jobs[jobID].meta
   });

});

/* =============================
STATUS (FINAL DETAIL)
============================= */

app.get("/api/status",(req,res)=>{

   const id=req.query.id;

   if(!jobs[id]){
      return res.status(404).json({error:"not found"});
   }

   res.json(jobs[id]);

});

/* =============================
WORKER
============================= */

async function startWorker(){

   if(processing) return;

   processing = true;

   while(queue.length>0){

      const jobID = queue.shift();

      await processJob(jobID);

   }

   processing = false;
}

function processJob(id){

   return new Promise(resolve=>{

      const job = jobs[id];

      job.status="processing";

      let progress=0;

      const interval=setInterval(()=>{

         progress+=10;

         job.progress = progress;

         if(progress>=100){

            job.status="complete";
            clearInterval(interval);

            resolve();

         }

      },2000);

   });
}

/* =============================
SERVER STATUS
============================= */

app.get("/api/status/server",(req,res)=>{

   res.json({

      online:true,
      jobs:Object.keys(jobs).length,
      queue:queue.length,
      processing

   });

});

/* =============================
ROOT ROUTER
============================= */

app.get("/",(req,res)=>{
   res.sendFile(path.join(ROOT,"index.html"));
});

app.get(/^\/(?!api).*/,(req,res,next)=>{

   let requestPath=req.path;

   if(!requestPath.includes(".")){
      requestPath+=".html";
   }

   res.sendFile(path.join(ROOT,requestPath),(err)=>{
      if(err) next();
   });

});

/* =============================
START
============================= */

const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{
   console.log("🔥 ULTRA ENGINE FINAL READY:",PORT);
});
