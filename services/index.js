const express = require("express");
const path = require("path");
const express = require("express");
const path = require("path");

require("../db/db");

const renderRoute = require("../routes/render");
const statusRoute = require("../routes/status");
const webhookRoute = require("../routes/webhook");

const app = express();

app.use(express.json());

app.use("/api/render",renderRoute);
app.use("/api/status",statusRoute);
app.use("/api/webhook",webhookRoute);

app.use(express.json());

app.use("/api/render",renderRoute);
app.use("/api/status",statusRoute);

app.use(express.static(path.join(__dirname,"../public")));

app.get("/",(req,res)=>{
   res.sendFile(path.join(__dirname,"../public","index.html"));
});

app.listen(process.env.PORT || 10000,()=>{
   console.log("ULTRA ENGINE SQL LIVE");
});
