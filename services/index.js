const express = require("express");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");

const app = express();
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const ROOT = path.join(__dirname,"..");

/* STATIC */

app.use("/assets", express.static(path.join(ROOT,"assets")));
app.use(express.static(ROOT));

/* ===================================
ULTRA ENGINE GOD MODE CORE
=================================== */

let jobs = {};
let queue = [];
let processing = false;

let ipUsage = {};
let clients = new Set();

/* WEBSOCKET */

wss.on("connection",(ws,req)=>{

   clients.add(ws);

   ws.on("close",()=>{

      clients.delete(ws);

   });

});

/* BROADCAST */

function broadcast(data){

   const msg = JSON.stringify(data);

   clients.forEach(ws=>{

      if(ws.readyState===WebSocket.OPEN){
         ws.send(msg);
      }

   });

}

/* ===================================
SECURITY — FREE 3 TIMES PER IP
=================================== */

function getIP(req){

   return req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

}

/* CREATE JOB */

app.post("/api/render",(req,res)=>{

   const ip = getIP(req);

   if(!ipUsage[ip]) ipUsage[ip]=0;

   if(ipUsage[ip] >= 3){

      return res.status(403).json({error:"FREE LIMIT REACHED"});

   }

   ipUsage[ip]++;

   const jobID = Date.now().toString();

   jobs[jobID]={
      status:"queued",
      progress:0,
      ip
   };

   queue.push(jobID);

   console.log("NEW JOB:",jobID);

   broadcast({
      type:"job_new",
      jobID
   });

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

/* SERVER STATUS REALTIME */

app.get("/api/status/server",(req,res)=>{

   res.json({
      online:true,
      liveUsers:clients.size,
      queue:queue.length,
      jobs:Object.keys(jobs).length,
      processing
   });

});

/* LIVE USERS */

app.get("/api/live-users",(req,res)=>{

   res.json({users:clients.size});

});

/* WORKER */

async function startWorker(){

   if(processing) return;

   processing=true;

   while(queue.length>0){

      const jobID = queue.shift();

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

         broadcast({
            type:"job_update",
            jobID:id,
            status:jobs[id].status,
            progress
         });

         if(progress>=100){

            jobs[id].status="complete";

            broadcast({
               type:"job_complete",
               jobID:id
            });

            clearInterval(interval);
            resolve();

         }

      },1000);

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

   console.log("🔥 ULTRA ENGINE GOD MODE LIVE:",PORT);

});
