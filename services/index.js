require("dotenv").config();

console.log("RUNWAY ENV:", process.env.RUNWAY_API_KEY);
console.log("GOOGLE ENV:", process.env.GOOGLE_CLIENT_ID);
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { OAuth2Client } = require("google-auth-library");

const { create } = require("../controllers/create.controller.js");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage()
});

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// ================= GOOGLE AUTH =================

app.post("/api/auth/google", async (req,res)=>{

  try{

    const { token } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    res.json({
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture
    });

  }catch(err){
    res.status(401).json({error:"INVALID GOOGLE TOKEN"});
  }

});


// ================= RENDER =================

app.post("/api/render", upload.any(), create);


// ================= STATUS =================

app.get("/api/status/server",(req,res)=>{
  res.json({ server:"online" });
});

app.get("/api/status/ai",(req,res)=>{
  res.json({ ai:"ready" });
});


// =================================================
// ✅ ADD ONLY — NETWORK STATUS (FIX 404 ERROR)
// =================================================

app.get("/api/status/network",(req,res)=>{
  res.json({
    network:"ok"
  });
});


// ================= ROOT CHECK =================

app.get("/",(req,res)=>{
  res.send("SN DESIGN API RUNNING");
});


const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{
  console.log("ULTRA ENGINE RUNNING:",PORT);
});
