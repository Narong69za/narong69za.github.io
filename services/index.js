const express = require("express");
const path = require("path");
const cors = require("cors");

const queue = require("./queue");

const app = express();

app.use(cors());
app.use(express.json());

const ROOT = path.join(__dirname,"..");

app.use("/assets", express.static(path.join(ROOT,"assets")));
app.use(express.static(ROOT));

/* =========================
REAL JOB STORAGE
========================= */

let jobs={};

/* =========================
CREATE RENDER JOB
========================= */

app.post("/api/render",(req,res)=>{

const jobID = Date.now().toString();

jobs[jobID]={
status:"queued",
progress:0
};

queue.add(jobID,jobs);

res.json({jobID});

});

/* =========================
STATUS CHECK
========================= */

app.get("/api/status",(req,res)=>{

const id=req.query.id;

if(!jobs[id]){
return res.status(404).json({error:"not found"});
}

res.json(jobs[id]);

});

/* =========================
ROUTER AUTO HTML
========================= */

app.get("/",(req,res)=>{
res.sendFile(path.join(ROOT,"index.html"));
});

app.get(/^\/(?!api).*/,(req,res,next)=>{

let requestPath=req.path;

if(!requestPath.includes(".")){
requestPath+=".html";
}

const filePath=path.join(ROOT,requestPath);

res.sendFile(filePath,(err)=>{
if(err) next();
});

});

const PORT=process.env.PORT || 10000;

app.listen(PORT,()=>{
console.log("🔥 ULTRA REAL ENGINE LIVE:",PORT);
});
