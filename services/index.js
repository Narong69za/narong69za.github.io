const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/* =============================
ROOT
============================= */

const ROOT = path.join(__dirname,"..");

/* =============================
STATIC
============================= */

app.use("/assets", express.static(path.join(ROOT,"assets")));
app.use(express.static(ROOT));

/* =============================
ULTRA ENGINE CORE
============================= */

let jobs = {};
let queue = [];

const MAX_WORKERS = 2;
let activeWorkers = 0;

/* =============================
CREATE JOB
============================= */

app.post("/api/render",(req,res)=>{

   const jobID = Date.now().toString();

   jobs[jobID]={
      id:jobID,
      status:"queued",
      progress:0,
      result:null,
      created:Date.now()
   };

   queue.push(jobID);

   console.log("🔥 NEW JOB:",jobID);

   runWorkers();

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
RESULT (future download)
============================= */

app.get("/api/result",(req,res)=>{

   const id=req.query.id;

   if(!jobs[id]) return res.status(404).end();

   res.json({
      result: jobs[id].result
   });

});

/* =============================
WORKER SYSTEM
============================= */

function runWorkers(){

   while(activeWorkers < MAX_WORKERS && queue.length>0){

      const jobID = queue.shift();

      activeWorkers++;

      processJob(jobID).then(()=>{

         activeWorkers--;
         runWorkers();

      });

   }

}

/* =============================
REAL PROCESS (SIMULATION)
replace later with AI render
============================= */

function processJob(id){

   return new Promise(resolve=>{

      if(!jobs[id]) return resolve();

      jobs[id].status="processing";

      let progress=0;

      const interval=setInterval(()=>{

         progress+=5;

         jobs[id].progress=progress;

         if(progress>=100){

            jobs[id].status="complete";

            jobs[id].result = "/assets/demo-result.mp4";

            console.log("✅ COMPLETE:",id);

            clearInterval(interval);

            resolve();

         }

      },1000);

   });

}

/* =============================
ROOT
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
SERVER
============================= */

const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{
   console.log("🔥 ULTRA ENGINE FINAL LIVE:",PORT);
});
