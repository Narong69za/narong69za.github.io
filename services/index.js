const express = require("express");
const path = require("path");
const os = require("os");

const app = express();

app.use(express.json());

/* ================================
ROOT
================================ */

const ROOT = path.join(__dirname,"..");

app.use("/assets", express.static(path.join(ROOT,"assets")));
app.use(express.static(ROOT));

/* ================================
ENV
================================ */

const ADMIN_KEY = process.env.ADMIN_KEY || "true";

/* ================================
GLOBAL STATE
================================ */

let jobs = {};
let queue = [];
let processing = false;

let liveUsers = new Set();

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
      wallets[user] = { balance:0 };
   }

   return wallets[user];
}

function generateID(){

   return Date.now().toString() + "_" + Math.random().toString(36).slice(2);

}

function calculateCost(duration){

   return Math.ceil(duration/5);

}

/* ================================
LIVE USERS
================================ */

app.use((req,res,next)=>{

   const ip = getIP(req);
   liveUsers.add(ip);

   next();
});

/* ================================
ADMIN SHIELD
================================ */

function adminGuard(req,res,next){

   const key = req.headers["x-admin"];

   if(key !== ADMIN_KEY){
      return res.json({error:"blocked"});
   }

   next();
}

/* ================================
RENDER ENGINE
================================ */

app.post("/api/render",(req,res)=>{

   const jobID = generateID();

   const duration = req.body.duration || 10;

   jobs[jobID] = {

      id:jobID,

      status:"queued",
      progress:0,
      stage:"queued",

      meta:{
         user:req.body.user || "guest",
         templateID:req.body.templateID || "unknown",
         platform:req.body.platform || "unknown",

         duration,

         cost: calculateCost(duration),

         created:Date.now(),

         input:req.body.input || null,
         output:`/renders/render_${jobID}.mp4`,

         requestIP:getIP(req)
      }

   };

   queue.push(jobID);

   startWorker();

   res.json({

      requestID:jobID,
      status:"accepted"

   });

});

/* STATUS */

app.get("/api/status",(req,res)=>{

   const id=req.query.id;

   if(!jobs[id]){
      return res.status(404).json({error:"not found"});
   }

   res.json(jobs[id]);

});

/* ================================
WORKER
================================ */

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
      jobs[id].stage="rendering";

      let progress=0;

      const interval=setInterval(()=>{

         progress+=10;

         jobs[id].progress=progress;

         if(progress>=100){

            jobs[id].status="complete";
            jobs[id].stage="done";

            jobs[id].meta.videoUrl = jobs[id].meta.output;

            clearInterval(interval);
            resolve();

         }

      },2000);

   });
}

/* ================================
WALLET SYSTEM
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

/* ================================
ADMIN API
================================ */

app.get("/api/admin/jobs",adminGuard,(req,res)=>{

   res.json(jobs);

});

app.get("/api/admin/wallet",adminGuard,(req,res)=>{

   res.json({
      wallets,
      transactions
   });

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
ROUTER
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
START
================================ */

const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{
   console.log("🔥 ULTRA ENGINE FINAL CORE LIVE:",PORT);
});
