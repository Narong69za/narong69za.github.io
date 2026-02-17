/* ============================
ULTRA ENGINE FINAL SERVER
============================ */

const express = require("express");
const path = require("path");

const renderRoute = require("./routes/render");
const statusRoute = require("./routes/status");

require("./db/db");

const app = express();

/* ============================
MIDDLEWARE
============================ */

app.use(express.json());

/* ============================
STATIC FRONTEND
============================ */

app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>{

   res.sendFile(path.join(__dirname,"public","index.html"));

});

/* ============================
API ROUTES
============================ */

app.use("/api/render",renderRoute);
app.use("/api/status",statusRoute);

/* ============================
START SERVER
============================ */

const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{

   console.log("ULTRA ENGINE LOCK ACTIVE ON PORT:",PORT);

});
