const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

const ROOT = path.join(__dirname,"..");

app.use("/assets", express.static(path.join(ROOT,"assets")));
app.use(express.static(ROOT));

/* =============================
ULTRA JOB ENGINE
============================= */

let jobs = {};
let queue = [];
let processing = false;

/* CREATE JOB */

app.post("/api/render",(req,res)=>{

   const jobID = Date.now().toString();

   jobs[jobID]={
      status:"queued",
      progress:0
   };

   queue.push(jobID);

   console.log("NEW JOB:", jobID);

   startWorker();

   res.json({jobID});
});

/* STATUS */

app.get("/api/status",(req,res)=>{

   const id=req.query.id;

   if(!jobs[id]){
      return res.status(404).json({error:"not found"});
   }

   res.json(jobs[id]);
});

/* WORKER */

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

      jobs[id].status="processing";

      let progress=0;

      const interval=setInterval(()=>{

         progress+=10;
         jobs[id].progress=progress;

         if(progress>=100){

            jobs[id].status="complete";
            clearInterval(interval);
            resolve();

         }

      },2000);

   });
}

/* ROOT */

app.get("/",(req,res)=>{
   res.sendFile(path.join(ROOT,"index.html"));
});

/* AUTO HTML ROUTER */

app.get(/^\/(?!api).*/,(req,res,next)=>{

   let requestPath=req.path;

   if(!requestPath.includes(".")){
      requestPath+=".html";
   }

   res.sendFile(path.join(ROOT,requestPath),(err)=>{
      if(err) next();
   });

});

const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{
   console.log("
