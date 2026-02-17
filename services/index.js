const express = require("express");
const path = require("path");

const adminGuard = require("../guard");

const app = express();

app.use(express.json());

const ROOT = path.join(__dirname,"..");

/* STATIC */

app.use("/assets", express.static(path.join(ROOT,"assets")));
app.use("/ultra-dev-9xX7-control", express.static(path.join(ROOT,"admin")));
app.use(express.static(ROOT));

/* ==============================
ULTRA JOB ENGINE
============================== */

let jobs = {};
let queue = [];
let processing = false;

app.post("/api/render",(req,res)=>{

    const jobID = Date.now().toString();

    jobs[jobID]={status:"queued",progress:0};

    queue.push(jobID);

    startWorker();

    res.json({jobID});

});

app.get("/api/status",(req,res)=>{

    const id=req.query.id;

    if(!jobs[id]) return res.status(404).json({error:"not found"});

    res.json(jobs[id]);

});

/* SERVER STATUS */

app.get("/api/status/server",(req,res)=>{

    res.json({
        online:true,
        queue:queue.length,
        processing:processing,
        jobs:Object.keys(jobs).length,
        memory:process.memoryUsage(),
        uptime:process.uptime()
    });

});

/* LIVE USERS (mock) */

app.get("/api/live-users",(req,res)=>{

    res.json({
        total:1,
        users:[req.ip]
    });

});

/* ADMIN WALLET */

app.get("/api/admin/wallet",adminGuard,(req,res)=>{

    res.json({
        wallets:{},
        transactions:[]
    });

});

/* JOB LIST */

app.get("/api/jobs",adminGuard,(req,res)=>{

    res.json(jobs);

});

/* WORKER */

async function startWorker(){

    if(processing) return;

    processing=true;

    while(queue.length>0){

        const id=queue.shift();

        await processJob(id);

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

const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{

    console.log("🔥 ULTRA ENGINE FULL SYSTEM LIVE:",PORT);

});
