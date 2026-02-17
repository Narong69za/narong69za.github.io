const express = require("express");
const path = require("path");
const http = require("http");
const {startSocket,broadcast} = require("./socket");

const app = express();

app.use(express.json());

const ROOT = path.join(__dirname,"..");

app.use("/assets", express.static(path.join(ROOT,"assets")));
app.use(express.static(ROOT));

/* =================
GLOBAL STATE
================= */

let jobs = {};
let queue = [];
let processing = false;

let liveUsers = new Set();

const wallets = {};
const transactions = [];

/* =================
HELPERS
================= */

function getIP(req){

   return (
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "unknown"
   ).toString().split(",")[0];

}

function getWallet(user){

   if(!wallets[user]){
      wallets[user]={balance:0};
   }

   return wallets[user];

}

/* =================
LIVE USERS
================= */

app.use((req,res,next)=>{
   liveUsers.add(getIP(req));
   next();
});

/* =================
ADMIN SHIELD
================= */

app.use("/api/admin",(req,res,next)=>{

   if(req.headers["x-admin"]!=="true"){
      return res.json({error:"blocked"});
   }

   next();
});

/* =================
JOB ENGINE
================= */

app.post("/api/render",(req,res)=>{

   const jobID = Date.now().toString();

   jobs[jobID]={status:"queued",progress:0};

   queue.push(jobID);

   startWorker();

   res.json({jobID});
});

app.get("/api/status",(req,res)=>{
   res.json(jobs[req.query.id]||{error:"not found"});
});

async function startWorker(){

   if(processing) return;

   processing=true;

   while(queue.length>0){

      const id = queue.shift();

      await processJob(id);

      broadcast({type:"queue",queue:queue.length});
   }

   processing=false;
}

function processJob(id){

   return new Promise(resolve=>{

      jobs[id].status="processing";

      let p=0;

      const i=setInterval(()=>{

         p+=10;
         jobs[id].progress=p;

         if(p>=100){
            jobs[id].status="complete";
            clearInterval(i);
            resolve();
         }

      },1000);

   });
}

/* =================
WALLET
================= */

app.post("/api/wallet/deposit",(req,res)=>{

   const {user,amount}=req.body;

   if(!user||amount<50||amount>500){
      return res.json({error:"invalid"});
   }

   const w=getWallet(user);

   w.balance+=amount;

   transactions.push({type:"deposit",user,amount,time:Date.now()});

   broadcast({type:"wallet",user,balance:w.balance});

   res.json({success:true,balance:w.balance});
});

/* =================
ADMIN API
================= */

app.get("/api/admin/wallet",(req,res)=>{
   res.json({wallets,transactions});
});

app.get("/api/admin/jobs",(req,res)=>{
   res.json(jobs);
});

app.get("/api/admin/queue",(req,res)=>{
   res.json({queue:queue.length,processing,jobs});
});

/* =================
STATUS
================= */

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

app.get("/api/live-users",(req,res)=>{
   res.json({
      total:liveUsers.size,
      users:Array.from(liveUsers)
   });
});

/* =================
ROUTES
================= */

app.get("/",(req,res)=>{
   res.sendFile(path.join(ROOT,"index.html"));
});

app.get(/^\/(?!api).*/,(req,res,next)=>{

   let p=req.path;

   if(!p.includes(".")) p+=".html";

   res.sendFile(path.join(ROOT,p),(e)=>{if(e)next();});
});

/* =================
START
================= */

const PORT = process.env.PORT || 10000;

const server = http.createServer(app);

startSocket(server);

server.listen(PORT,()=>{
   console.log("🔥 ULTRA ADMIN GOD MATRIX LIVE:",PORT);
});
