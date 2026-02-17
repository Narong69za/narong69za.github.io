const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/* =============================
ROOT PATH
============================= */

const ROOT = path.join(__dirname,"..");

/* =============================
STATIC FILES
============================= */

app.use("/assets", express.static(path.join(ROOT,"assets")));
app.use(express.static(ROOT));

/* =============================
ULTRA ENGINE CORE
============================= */

let jobs = {};
let queue = [];
let processingWorkers = 0;

const MAX_WORKERS = 2; // parallel render (เพิ่มได้)

/* =============================
CREATE JOB
============================= */

app.post("/api/render",(req,res)=>{

   const jobID = Date.now().toString();

   jobs[jobID]={
      id: jobID,
      status:"queued",
      progress:0,
      created: Date.now()
   };

   queue.push(jobID);

   console.log("🔥 NEW JOB:", jobID);

   startWorkers();

   res.json({jobID});
});

/* =============================
STATUS
============================= */

app.get("/api/status",(req,res)=>{

   const id=req.query.id;

   if(!jobs[id]){
      return res.status(404).json({error:"not found"});
   }

   res.json(jobs[id]);
});

/* =============================
WORKER SYSTEM (PARALLEL)
============================= */

async function startWorkers(){

   while(processingWorkers < MAX_WORKERS && queue.length>0){

      const jobID = queue.shift();

      processingWorkers++;

      runJob(jobID).then(()=>{
         processingWorkers--;
         startWorkers();
      });

   }
}

/* =============================
REAL PROCESS SIMULATION
============================= */

function runJob(id){

   return new Promise(resolve=>{

      if(!jobs[id]) return resolve();

      jobs[id].status="processing";

      let progress=0;

      const interval=setInterval(()=>{

         progress+=5;

         jobs[id].progress=progress;

         if(progress>=100){

            jobs[id].status="complete";

            clearInterval(interval);

            console.log("✅ COMPLETE:", id);

            resolve();

         }

      },1000);

   });
}

/* =============================
ROOT INDEX
============================= */

app.get("/",(req,res)=>{
   res.sendFile(path.join(ROOT,"index.html"));
});

/* =============================
AUTO HTML ROUTER
============================= */

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
SERVER START
============================= */

const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{
   console.log("🔥 ULTRA REAL ENGINE LIVE:",PORT);
});
