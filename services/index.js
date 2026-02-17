const express = require("express");
const path = require("path");
const http = require("http");
const crypto = require("crypto");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

/* =============================
ROOT
============================= */

const ROOT = path.join(__dirname,"..");

app.use("/assets", express.static(path.join(ROOT,"assets")));
app.use(express.static(ROOT));

/* =============================
ULTRA STATE
============================= */

let jobs = {};
let queue = [];

let users = {};       // token users
let ipUsage = {};     // free limit tracker

const MAX_WORKERS = 2;
let activeWorkers = 0;

/* =============================
REALTIME BROADCAST
============================= */

function broadcast(data){

   const msg = JSON.stringify(data);

   wss.clients.forEach(ws=>{
      if(ws.readyState === WebSocket.OPEN){
         ws.send(msg);
      }
   });

}

/* =============================
SECURITY LAYER
============================= */

function getIP(req){

   return req.headers["x-forwarded-for"]?.split(",")[0] ||
          req.socket.remoteAddress;

}

function authLite(req,res,next){

   let token = req.headers["x-token"];

   if(!token){

      token = crypto.randomBytes(12).toString("hex");

      users[token]={ created:Date.now(), credit:0 };

      res.setHeader("x-token",token);

   }

   req.token = token;

   if(!users[token]){
      users[token]={ created:Date.now(), credit:0 };
   }

   next();
}

app.use(authLite);

/* =============================
FREE LIMIT CHECK
============================= */

function checkFreeLimit(ip){

   if(!ipUsage[ip]){
      ipUsage[ip]=0;
   }

   if(ipUsage[ip] < 3){
      ipUsage[ip]++;
      return true;
   }

   return false;
}

/* =============================
CREATE JOB
============================= */

app.post("/api/render",(req,res)=>{

   const ip = getIP(req);

   const user = users[req.token];

   const free = checkFreeLimit(ip);

   if(!free && user.credit<=0){

      return res.status(403).json({
         error:"no credit"
      });

   }

   if(!free){
      user.credit--;
   }

   const jobID = Date.now().toString();

   jobs[jobID]={
      id:jobID,
      status:"queued",
      progress:0,
      result:null,
      ip,
      token:req.token
   };

   queue.push(jobID);

   broadcast({type:"new_job",jobID});

   runWorkers();

   res.json({jobID});

});

/* =============================
STATUS
============================= */

app.get("/api/status",(req,res)=>{

   const id=req.query.id;

   if(!jobs[id]) return res.status(404).end();

   res.json(jobs[id]);

});

/* =============================
SERVER DASHBOARD DATA
============================= */

app.get("/api/system",(req,res)=>{

   res.json({

      queue:queue.length,
      workers:activeWorkers,
      jobs:Object.keys(jobs).length,
      users:Object.keys(users).length,

      gpu:{
         status:"ready",
         load: Math.floor(Math.random()*100)
      }

   });

});

/* =============================
TOPUP SYSTEM (placeholder)
============================= */

app.post("/api/topup",(req,res)=>{

   const amount = req.body.amount;

   if(amount < 50 || amount > 500){

      return res.status(400).json({error:"invalid range"});
   }

   users[req.token].credit += amount;

   res.json({success:true,credit:users[req.token].credit});

});

/* =============================
WORKERS
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

function processJob(id){

   return new Promise(resolve=>{

      if(!jobs[id]) return resolve();

      jobs[id].status="processing";

      let progress=0;

      const interval=setInterval(()=>{

         progress+=5;

         jobs[id].progress=progress;

         broadcast({
            type:"progress",
            jobID:id,
            progress
         });

         if(progress>=100){

            jobs[id].status="complete";
            jobs[id].result="/assets/demo-result.mp4";

            broadcast({
               type:"complete",
               jobID:id
            });

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

server.listen(PORT,()=>{
   console.log("🔥 ULTRA ENGINE GOD MODE LIVE:",PORT);
});
