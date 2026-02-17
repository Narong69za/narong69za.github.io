const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

const ROOT = path.join(__dirname,"..");

app.use("/assets", express.static(path.join(ROOT,"assets")));
app.use(express.static(ROOT));

/* =============================
ULTRA JOB ENGINE FINAL
============================= */

let jobs = {};
let queue = [];
let processing = false;

app.post("/api/render",(req,res)=>{

   const { templateID, engine, duration } = req.body;

   const jobID = Date.now().toString();

   jobs[jobID]={
      jobID,
      templateID,
      engine,
      duration,
      status:"queued",
      progress:0,
      created:Date.now()
   };

   queue.push(jobID);

   startWorker();

   res.json({ jobID });

});

app.get("/api/status",(req,res)=>{

   const id=req.query.id;

   if(!jobs[id]){
      return res.status(404).json({error:"not found"});
   }

   res.json(jobs[id]);
});

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

      jobs[id].status="processing";

      let p=0;

      const interval=setInterval(()=>{

         p+=10;
         jobs[id].progress=p;

         if(p>=100){

            jobs[id].status="complete";

            clearInterval(interval);
            resolve();

         }

      },1500);

   });

}

/* ROUTER */

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

const PORT=process.env.PORT || 10000;

app.listen(PORT,()=>{

   console.log("ULTRA FINAL ENGINE RUNNING",PORT);

});
