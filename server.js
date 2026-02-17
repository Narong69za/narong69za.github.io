const express = require("express");
const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/* ===================================
STATIC FRONTEND FINAL FIX
=================================== */

app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>{

   res.sendFile(path.join(__dirname,"public","index.html"));

});
const renderRoute = require("./routes/render");
const statusRoute = require("./routes/status");

require("./db/db");

const app = express();

app.use(express.json());

app.use("/api/render",renderRoute);
app.use("/api/status",statusRoute);
const path = require("path");

/* ==========================================
SERVE FRONTEND STATIC (ULTRA FIX)
========================================== */

app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>{

   res.sendFile(path.join(__dirname,"public","index.html"));

});
app.listen(process.env.PORT || 10000,()=>{

   console.log("ULTRA ENGINE LOCK ACTIVE");

});
