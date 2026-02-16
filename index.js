require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

/* ======================================================
CORE MIDDLEWARE
====================================================== */

app.use(express.json());

/* ======================================================
STATIC WEBSITE SERVE
====================================================== */

app.use(express.static(__dirname));

/* ======================================================
API ROUTER (MAIN BACKEND)
====================================================== */

try{
   app.use('/api', require('./api/api.route'));
   console.log("API ROUTER LOADED");
}catch(e){
   console.log("API ROUTER LOAD ERROR:", e.message);
}

/* ======================================================
ROOT STATUS CHECK
====================================================== */

app.get("/", (req,res)=>{
   res.send("🔥 SN DESIGN SERVER ONLINE 🔥");
});

/* ======================================================
SN DESIGN AUTO QUEUE ENGINE
====================================================== */

const jobQueue = new Map();

global.SN_QUEUE = jobQueue;

global.SN_CREATE_JOB = function(data){

   const id = "job_" + Date.now();

   jobQueue.set(id,{
      status:"pending",
      input:data,
      output:null
   });

   return id;
}

global.SN_UPDATE_JOB = function(id,data){

   if(!jobQueue.has(id)) return;

   jobQueue.set(id,{
      ...jobQueue.get(id),
      ...data
   });
}

/* ======================================================
SERVER START
====================================================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
   console.log("🔥 SN DESIGN SERVER RUNNING:",PORT);
});
