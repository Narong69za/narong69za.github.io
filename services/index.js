const express = require("express");
const path = require("path");
const os = require("os");

const app = express();

app.use(express.json());

/* ================================
ROOT PATH
================================ */

const ROOT = path.join(__dirname,"..");

app.use("/assets", express.static(path.join(ROOT,"assets")));
app.use(express.static(ROOT));

/* ================================
GLOBAL STATE
================================ */

let jobs = {};
let queue = [];
let processing = false;

let liveUsers = new Set();

/* WALLET SYSTEM */

const wallets = {};
const transactions = [];

/* ================================
HELPERS
================================ */

function getIP(req){

   return (
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "unknown"
   ).toString().split(",")[0];

}

function getWallet(user){

   if(!wallets[user]){
      wallets[user] = {
         balance:0
      };
   }

   return wallets[user];

}

/* ================================
LIVE USER TRACKING
================================ */

app.use((req,res,next)=>{

   const ip = getIP(req);
   liveUsers.add(ip);

   next();
});

/* ================================
ADMIN SHIELD
================================ */

app.use("/api/admin",(req,res,next)=>{

   const adminKey = req.headers["x-admin"];

   if(adminKey !== "true"){
      return res.json({error:"blocked"});
   }

   next();
});

/* ================================
ULTRA JOB ENGINE
================================ */

app.post("/api/render",(req,res)=>{

   const jobID = Date.now().toString();

   jobs[jobID] = {
      status:"queued",
      progress:0
   };

   queue.push(jobID);

   startWorker();

   res.json({jobID});

});

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

/* ================================
WALLET / ATM SYSTEM
================================ */

app.post("/api/wallet/deposit",(req,res)=>{

   const {user,amount} = req.body;

   if(!user || !amount){
      return res.json({error:"invalid"});
   }

   if(amount < 50 || amount > 500){
      return res.json({error:"invalid amount"});
   }

   const w = getWallet(user);

   w.balance += amount;

   transactions.push({
      type:"deposit",
      user,
      amount,
      time:Date.now()
   });

   res.json({success:true,balance:w.balance});

});

app.post("/api/wallet/withdraw",(req,res)=>{

   try{

      const {user,amount} = req.body;

      const w = getWallet(user);

      if(w.balance < amount){
         return res.json({error:"not enough balance"});
      }

      w.balance -= amount;

      transactions.push({
         type:"withdraw",
         user,
         amount,
         time:Date.now()
      });

      res.json({success:true,balance:w.balance});

   }catch(e){

      res.json({error:e.message});

   }

});

/* ================================
ADMIN API
================================ */

app.get("/api/admin/wallet",(req,res)=>{

   res.json({
      wallets,
      transactions
   });

});

app.get("/api/admin/jobs",(req,res)=>{
   res.json(jobs);
});

/* ================================
SERVER STATUS
================================ */

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

/* ================================
ROOT
================================ */

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

/* ================================
START SERVER
================================ */

const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{
   console.log("🔥 ULTRA ENGINE ADMIN CORE LIVE:",PORT);
});
