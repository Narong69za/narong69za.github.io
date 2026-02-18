const express = require("express");
const path = require("path");

require("../db/db");

const renderRoute = require("../routes/render");
const statusRoute = require("../routes/status");

const app = express();

app.use(express.json());

/* =========================
SERVE WEBSITE ROOT (MASTER)
========================= */

app.use(express.static(path.join(__dirname,"..")));

app.get("/",(req,res)=>{
   res.sendFile(path.join(__dirname,"../index.html"));
});

/* =========================
API
========================= */

app.use("/api/render",renderRoute);
app.use("/api/status",statusRoute);

/* ========================= */

const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{
   console.log("🔥 ULTRA ENGINE ROOT MODE:",PORT);
});
