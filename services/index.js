const express = require("express");
const path = require("path");
const http = require("http");
const crypto = require("crypto");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

const ROOT = path.join(__dirname,"..");

app.use("/assets", express.static(path.join(ROOT,"assets")));
app.use(express.static(ROOT));

/* =====================================
COSMIC DATABASE (memory core)
===================================== */

let jobs = {};
let queue = [];
let priorityQueue = [];

let processing = false;

let users = {};
let tokens = {};
let ipUsage = {};
let liveUsers = {};

/* =====================================
HELPERS
===================================== */

function createToken(){

   return crypto.randomBytes(24).toString("hex");

}

function getIP(req){

   return req.headers["x-forwarded-for"] || req.socket.remoteAddress;

}

function getUser(req){

   const token = req.headers.authorization;

   if(!token || !tokens[token]) return null;

   return users[tokens[token]];

}

/* =====================================
WEBSOCKET REALTIME
===================================== */

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
      priority:priorityQueue.length,
      processing

   });

   wss.clients.forEach(c=>{

      if(c.readyState===1){

         c.send(payload);

      }

   });

}

/* =====================================
LOGIN LIGHT (NO PASSWORD)
===================================== */

app.post("/api/login",(req,res)=>{

   const ip = getIP(req);

   if(!users[ip]){

      users[ip]={

         id:ip,
         credit:0,
         free:3

      };

   }

   const token = createToken();

   tokens[token]=ip;

   res.json({

      token,
      user:users[ip]

   });

});

/* =====================================
WALLET TOPUP (50-500)
===================================== */

app.post("/api/wallet/topup",(req,res)=>{

   const user=getUser(req);

   if(!user) return res.status(401).json({error:"unauthorized"});

   const amount=req.body.amount;

   if(amount<50 || amount>500){

      return res.json({error:"invalid amount"});

   }

   user.credit += amount;

   res.json({

      credit:user.credit

   });

});

/* =====================================
CREATE JOB
===================================== */

app.post("/api/render",(req,res)=>{

   const ip=getIP(req);

   const user=getUser(req);

   let priority=false;

   if(user){

      if(user.credit>0){

         user.credit--;
         priority=true;

      }
      else if(user.free>0){

         user.free--;

      }else{

         return res.json({error:"NO CREDIT"});

      }

   }else{

      if(!ipUsage[ip]) ipUsage[ip]=0;

      if(ipUsage[ip]>=3){

         return res.json({error:"FREE LIMIT"});

      }

      ipUsage[ip]++;

   }

   const jobID=Date.now().toString();

   jobs[jobID]={

      status:"queued",
      progress:0

   };

   if(priority){

      priorityQueue.push(jobID);

   }else{

      queue.push(jobID);

   }

   startWorker();

   res.json({jobID});

});

/* =====================================
STATUS
===================================== */

app.get("/api/status",(req,res)=>{

   const id=req.query.id;

   if(!jobs[id]){

      return res.status(404).json({error:"not found"});

   }

   res.json(jobs[id]);

});

app.get("/api/status/server",(req,res)=>{

   res.json({

      online:true,
      liveUsers:Object.keys(liveUsers).length,
      queue:queue.length,
      priority:priorityQueue.length,
      processing

   });

});

app.get("/api/status/ai",(req,res)=>{

   res.json({

      gpu:"ready",
      engine:"COSMIC",
      mode:"GOD"

   });

});

app.get("/api/live-users",(req,res)=>{

   res.json({

      count:Object.keys(liveUsers).length

   });

});

/* =====================================
WORKER
===================================== */

async function startWorker(){

   if(processing) return;

   processing=true;

   while(priorityQueue.length>0 || queue.length>0){

      let jobID;

      if(priorityQueue.length>0){

         jobID=priorityQueue.shift();

      }else{

         jobID=queue.shift();

      }

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

/* =====================================
ROUTER
===================================== */

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

/* =====================================
START
===================================== */

const PORT=process.env.PORT||10000;

server.listen(PORT,()=>{

   console.log("🔥 ULTRA ENGINE COSMIC FORM LIVE:",PORT);

});
