const express = require("express");
const path = require("path");

const { createJob,getJob } = require("./jobQueue");
const { startRender } = require("./engineWorker");

const app = express();

app.use((req,res,next)=>{
   res.header("Access-Control-Allow-Origin","*");
   res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
   res.header("Access-Control-Allow-Methods","GET,POST,OPTIONS");
   next();
});

app.use(express.json());

const ROOT = path.join(__dirname,"..");

/* STATIC */

app.use("/assets", express.static(path.join(ROOT,"assets")));
app.use(express.static(ROOT));

/* ROOT */

app.get("/",(req,res)=>{
   res.sendFile(path.join(ROOT,"index.html"));
});

/* ======================================
ULTRA ENGINE API
====================================== */

app.post("/api/render",(req,res)=>{

   const job = createJob();

   console.log("🔥 NEW JOB:",job.id);

   startRender(job.id);

   res.json({
      jobID:job.id
   });

});

app.get("/api/status",(req,res)=>{

   const id = req.query.id;

   const job = getJob(id);

   if(!job){

      return res.status(404).json({
         status:"not_found"
      });

   }

   res.json(job);

});

/* AUTO HTML ROUTER */

app.get(/^\/(?!api).*/, (req,res,next)=>{

   let requestPath = req.path;

   if(!requestPath.includes(".")){
      requestPath += ".html";
   }

   const filePath = path.join(ROOT,requestPath);

   res.sendFile(filePath,(err)=>{
      if(err) next();
   });

});

const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{
   console.log("🔥 ULTRA REAL ENGINE LIVE:",PORT);
});
