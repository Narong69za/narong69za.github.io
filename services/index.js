const express = require("express");
const cors = require("cors");

const { create } = require("../controllers/create.controller");

const app = express();

app.use(cors());
app.use(express.json());

/* ======================================================
EXISTING ROUTE (LOCKED)
====================================================== */

app.post("/api/render", create);


/* ======================================================
ULTRA STATUS SYSTEM API
ADD ONLY — DO NOT REMOVE EXISTING ROUTES
Purpose:
Fix index.html live status bind
====================================================== */

app.get("/api/status/server",(req,res)=>{
   res.json({
      server:"online"
   });
});

app.get("/api/status/ai",(req,res)=>{
   res.json({
      ai:true
   });
});

app.get("/api/status/network",(req,res)=>{
   res.json({
      traffic: Math.floor(Math.random()*100)+1
   });
});


/* ======================================================
SERVER START
====================================================== */

const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
   console.log("ULTRA ENGINE RUNNING:",PORT);
});
