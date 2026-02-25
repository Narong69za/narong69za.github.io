require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { OAuth2Client } = require("google-auth-library");

const { create } = require("../controllers/create.controller");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage()
});

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ================= RENDER =================

app.post("/api/render", upload.any(), create);

// ================= STATUS =================

app.get("/api/status/server",(req,res)=>{
  res.json({ server:"online" });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
  console.log("ULTRA ENGINE RUNNING:",PORT);
});
