const express = require("express");
const cors = require("cors");
const multer = require("multer");

const { create } = require("../controllers/create.controller.js");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
   storage: multer.memoryStorage()
});

app.post("/api/render", upload.any(), create);

app.get("/api/status/server",(req,res)=>{
   res.json({ server:"online" });
});

app.get("/api/status/ai",(req,res)=>{
   res.json({ ai:true });
});

app.get("/api/status/network",(req,res)=>{
   res.json({
      traffic: Math.floor(Math.random()*100)+1
   });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
   console.log("ULTRA ENGINE RUNNING:",PORT);
});
