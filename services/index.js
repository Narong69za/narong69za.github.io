const express = require("express");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

const ROOT = path.join(__dirname,"..");

app.use("/assets", express.static(path.join(ROOT,"assets")));
app.use(express.static(ROOT));

/* ============================
ULTRA ENGINE CORE
============================ */

let jobs = {};
let queue = [];
let processing = false;

let liveUsers = {};
let ipUsage = {}; // ฟรี 3 ครั้ง

/* ============================
WEBSOCKET REALTIME
============================ */

wss.on("connection",(ws,req)=>{

   const ip = req.socket.remoteAddress;

   liveUsers[ip]=true;

   broadcast();

   ws.on("close",()=>{
      delete liveUsers[ip];
      broadcast();
   });

});

function broadcast(){

   const payload = JSON.stringify({
      type:"status",
      users:Object.keys(liveUsers).length,
      queue:queue.length,
      processing
   });

   wss.clients.forEach(c=>{
      if(c.readyState===1){
         c.send(payload);
      }
   });
}

/* ============================
CREATE JOB
============================ */

app.post("/api/render",(req,res)=>{

   const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

   if(!ipUsage[ip]) ipUsage[ip]=0;

   if(ipUsage[ip] >=3){
      return res.json({error:"FREE LIMIT REACHED"});
   }

   ipUsage[ip]++;

   const jobID = Date.now().toString();

   jobs[jobID]={
      status:"queued",
      progress:0
   };

   queue.push(jobID);

   console.log("NEW JOB:",jobID);

   startWorker();

   res.json({jobID});
});

/* ============================
STATUS
============================ */

app.get("/api/status",(req,res)=>{

   const id=req.query.id;

   if(!jobs[id]){
      return res.status(404).json({error:"not found"});
   }

   res.json(jobs[id]);
});

/* SERVER STATUS */

app.get("/api/status/server",(req,res)=>{

   res.json({
      online:true,
      liveUsers:Object.keys(liveUsers).length,
      queue:queue.length,
      jobs:Object.keys(jobs).length,
      processing
   });

});

/* AI STATUS */

app.get("/api/status/ai",(req,res)=>{

   res.json({
      gpu:"ready",
      renderEngine:"ULTRA",
      mode:"GOD"
   });

});

/* LIVE USERS */

app.get("/api/live-users",(req,res)=>{

   res.json({
      count:Object.keys(liveUsers).length
   });

});

/* ============================
WORKER
============================ */

async function startWorker(){

   if(processing) return;

   processing=true;

   while(queue.length>0){

      const jobID=queue.shift();

      await processJob(jobID);

   }

   processing=false;
}

function processJob(id){

   return new Promise(resolve=>{

      jobs[id].status="processing";

      let progress=0;

      const interval=setInterval(()=>{

         progress+=10;
         jobs[id].progress=progress;

         broadcast();

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

server.listen(PORT,()=>{

   console.log("🔥 ULTRA ENGINE SINGULARITY LIVE:",PORT);

});
