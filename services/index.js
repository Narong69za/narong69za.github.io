const express = require("express");
const path = require("path");
const os = require("os");

const app = express();
app.use(express.json());

const ROOT = path.join(__dirname,"..");
app.use(express.static(ROOT));

/* ======================
GLOBAL STATE
====================== */

let jobs = {};
let queue = [];
let processing=false;

const ENGINE_CONFIG = {
   "motion-v1":{
      engine:"ULTRA MOTION V1",
      resolution:"720p",
      durationLimit:30,
      creditCost:120,
      eta:45
   }
};

/* ======================
RENDER REQUEST
====================== */

app.post("/api/render",(req,res)=>{

   const {templateID="motion-v1"} = req.body;

   const jobID = Date.now().toString();

   const meta = ENGINE_CONFIG[templateID];

   jobs[jobID]={
      id:jobID,
      templateID,
      engine:meta.engine,
      resolution:meta.resolution,
      durationLimit:meta.durationLimit,
      creditCost:meta.creditCost,
      eta:meta.eta,
      status:"queued",
      progress:0,
      created:Date.now()
   };

   queue.push(jobID);

   startWorker();

   res.json(jobs[jobID]);
});

/* ======================
STATUS
====================== */

app.get("/api/status",(req,res)=>{

   const id=req.query.id;

   res.json(jobs[id] || {error:"not found"});
});

/* ======================
WORKER
====================== */

async function startWorker(){

   if(processing) return;

   processing=true;

   while(queue.length){

      const id=queue.shift();
      await processJob(id);

   }

   processing=false;
}

function processJob(id){

   return new Promise(resolve=>{

      let p=0;

      jobs[id].status="processing";

      const timer=setInterval(()=>{

         p+=10;
         jobs[id].progress=p;

         if(p>=100){

            jobs[id].status="complete";
            clearInterval(timer);
            resolve();

         }

      },2000);
   });
}

/* ======================
SERVER STATUS
====================== */

app.get("/api/status/server",(req,res)=>{

   res.json({
      online:true,
      queue:queue.length,
      processing,
      jobs:Object.keys(jobs).length,
      memory:process.memoryUsage(),
      uptime:process.uptime()
   });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{

   console.log("🔥 ULTRA ENGINE FINAL LIVE:",PORT);

});
/* ================================
ULTRA IMPORT TRACK (ADD ONLY)
================================ */

app.post("/api/render",(req,res)=>{

   const {
      templateID,
      motion,
      duration,
      inputFiles
   } = req.body || {};

   const jobID = Date.now().toString();

   jobs[jobID] = {

      status:"queued",
      progress:0,

      /* IMPORT DATA */
      templateID: templateID || null,
      motion: motion || null,
      duration: duration || null,
      inputFiles: inputFiles || []

   };

   queue.push(jobID);

   startWorker();

   res.json({jobID});

});
