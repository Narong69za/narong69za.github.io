const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

const ROOT = path.join(__dirname,"..");

app.use("/assets", express.static(path.join(ROOT,"assets")));
app.use(express.static(ROOT));

/* =============================
ULTRA ENGINE CORE DATA
============================= */

let jobs = {};
let queue = [];
let processing = false;

let liveUsers = {};
let wallets = {};
let transactions = [];
let freeUsage = {}; // free 3 times per IP

/* =============================
SECURITY + IP TRACKING
============================= */

app.use((req,res,next)=>{

   const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

   liveUsers[ip]=Date.now();

   req.clientIP = ip;

   next();
});

/* =============================
FREE LIMIT CHECK
============================= */

function checkFree(ip){

   if(!freeUsage[ip]) freeUsage[ip]=0;

   if(freeUsage[ip] >= 3){

      if(!wallets[ip] || wallets[ip].balance <=0){
         return false;
      }

      wallets[ip].balance -= 1; // cost 1 credit
   }

   freeUsage[ip]++;

   return true;
}

/* =============================
CREATE JOB
============================= */

app.post("/api/render",(req,res)=>{

   const ip=req.clientIP;

   if(!checkFree(ip)){
      return res.json({
         error:"NO CREDIT",
         message:"เติมเงินก่อน"
      });
   }

   const jobID = Date.now().toString();

   jobs[jobID]={
      status:"queued",
      progress:0,
      owner:ip
   };

   queue.push(jobID);

   console.log("🔥 NEW JOB:", jobID);

   startWorker();

   res.json({jobID});
});

/* =============================
JOB STATUS
============================= */

app.get("/api/status",(req,res)=>{

   const id=req.query.id;

   if(!jobs[id]){
      return res.status(404).json({error:"not found"});
   }

   res.json(jobs[id]);
});

/* =============================
WORKER
============================= */

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

/* =============================
ADMIN API
============================= */

app.get("/api/admin/server",(req,res)=>{

   res.json({
      online:true,
      queue:queue.length,
      processing,
      jobs:Object.keys(jobs).length,
      memory:process.memoryUsage(),
      uptime:process.uptime()
   });

});

app.get("/api/admin/live-users",(req,res)=>{

   const now=Date.now();

   const active=Object.entries(liveUsers)
      .filter(([ip,time])=> now-time < 60000);

   res.json({
      total:active.length,
      users:active.map(v=>v[0])
   });

});

app.get("/api/admin/jobs",(req,res)=>{
   res.json(jobs);
});

app.get("/api/admin/wallet",(req,res)=>{
   res.json({
      wallets,
      transactions
   });
});

/* =============================
PAYMENT TEST (เติมเงินจริง mock)
============================= */

app.post("/api/payment/topup",(req,res)=>{

   const ip=req.clientIP;

   const amount = Number(req.body.amount);

   if(amount < 50 || amount > 500){

      return res.json({
         error:"amount limit 50-500"
      });

   }

   if(!wallets[ip]){
      wallets[ip]={balance:0};
   }

   wallets[ip].balance += amount;

   transactions.push({
      type:"topup",
      ip,
      amount,
      time:Date.now()
   });

   res.json({
      success:true,
      balance:wallets[ip].balance
   });

});

/* =============================
ROOT
============================= */

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
   console.log("🔥 ULTRA ENGINE COSMIC LIVE:",PORT);
});
