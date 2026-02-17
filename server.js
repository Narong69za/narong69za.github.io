const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/* ===================================
LOAD DB
=================================== */

require("./db/db");

/* ===================================
API ROUTES
=================================== */

const renderRoute = require("./routes/render");
const statusRoute = require("./routes/status");

app.use("/api/render", renderRoute);
app.use("/api/status", statusRoute);

/* ===================================
STATIC FRONTEND
=================================== */

app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>{
   res.sendFile(path.join(__dirname,"public","index.html"));
});

/* ===================================
START SERVER
=================================== */

const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{
   console.log("ULTRA ENGINE LOCK ACTIVE ON:",PORT);
});
