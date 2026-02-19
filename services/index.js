/*
=====================================
SN DESIGN ULTRA ENGINE API
FULL FIX VERSION (RENDER SAFE)
=====================================
*/

const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { runEngine } =
require("../engine/motionEngine");

const app = express();

/* ================= CONFIG ================= */

app.use(cors());
app.use(express.json());

/* ================= HEALTH CHECK ================= */

app.get("/", (req,res)=>{
   res.send("SN DESIGN API ONLINE");
});

/* ================= MEMORY STORE (TEMP DB) ================= */

const jobs = {};

/* ================= RENDER ROUTE ================= */

app.post("/api/render", async (req,res)=>{

   try{

      const jobID = uuidv4();

      const data = {
         ...req.body,
         jobID
      };

      jobs[jobID] = {
         status:"processing",
         progress:0
      };

      runEngine(data)
      .then(()=>{
         jobs[jobID].status="complete";
         jobs[jobID].progress=100;
      })
      .catch(err=>{
         console.log(err);
         jobs[jobID].status="error";
      });

      res.json({
         success:true,
         jobID
      });

   }catch(e){

      console.log(e);

      res.status(500).json({
         error:"ENGINE FAIL"
      });

   }

});

/* ================= STATUS ROUTE ================= */

app.get("/api/status/:id",(req,res)=>{

   const job = jobs[req.params.id];

   if(!job){

      return res.json({
         status:"not_found",
         progress:0
      });

   }

   res.json(job);

});

/* ================= PORT BIND (RENDER RULE) ================= */

const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>{

   console.log("SN DESIGN API RUNNING ON PORT:",PORT);

});
