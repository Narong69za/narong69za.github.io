const express=require("express");
const app=express();

app.use(express.json());

/* =========================
DATABASE MOCK (แทน SQL)
========================= */

const projects={};

/* =========================
CREATE PROJECT
========================= */

app.post("/api/render",(req,res)=>{

const body=req.body||{};

if(!body.templateID){

return res.status(400).json({error:"missing templateID"});
}

const jobID="job_"+Date.now();

projects[jobID]={

jobID,
templateID:body.templateID,
engine:body.engine || "motion-ai",
duration:body.duration || 30,

status:"queued",
progress:0,
creditUsed:0,
eta:"calculating",
media:body.files||[]

};

startProcess(jobID);

res.json(projects[jobID]);

});

/* =========================
STATUS
========================= */

app.get("/api/status",(req,res)=>{

const id=req.query.id;

if(!projects[id]){

return res.status(404).json({error:"not found"});
}

res.json(projects[id]);

});

/* =========================
PROCESS SIMULATION
========================= */

function startProcess(id){

projects[id].status="processing";

let p=0;

const loop=setInterval(()=>{

p+=10;

projects[id].progress=p;
projects[id].creditUsed = (p/100)*30;
projects[id].eta = (100-p)/10+" sec";

if(p>=100){

projects[id].status="complete";
clearInterval(loop);

}

},1500);

}

const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{

console.log("SERVER STARTED ON:",PORT);

});
