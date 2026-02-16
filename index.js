const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("🔥 SN DESIGN SERVER ONLINE 🔥");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
// ======================================================
// SN DESIGN AUTO QUEUE ENGINE
// ======================================================

const jobQueue = new Map();

global.SN_QUEUE = jobQueue;

function createJob(data){

   const id = "job_" + Date.now();

   jobQueue.set(id,{
      status:"pending",
      input:data,
      output:null
   });

   return id;
}

function updateJob(id,data){

   if(!jobQueue.has(id)) return;

   jobQueue.set(id,{
      ...jobQueue.get(id),
      ...data
   });

}

global.SN_CREATE_JOB = createJob;
global.SN_UPDATE_JOB = updateJob;
