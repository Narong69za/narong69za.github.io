require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/* ===================================
STATIC WEBSITE
=================================== */

app.use(express.static(__dirname));

/* ===================================
GLOBAL JOB QUEUE
=================================== */

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

/* ===================================
API ROUTER LOAD
=================================== */

app.use('/api', require('./api/api.route'));

/* ===================================
ROOT CHECK
=================================== */

app.get("/", (req,res)=>{
   res.send("🔥 SN DESIGN SERVER ONLINE 🔥");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
   console.log("ULTRA FINAL PLATFORM RUNNING:",PORT);
});
// REAL NETWORK TRAFFIC

global.SN_TRAFFIC = {
   activeUsers:0
};

app.use((req,res,next)=>{

   global.SN_TRAFFIC.activeUsers++;

   res.on("finish",()=>{
      global.SN_TRAFFIC.activeUsers--;
   });

   next();
});

});
