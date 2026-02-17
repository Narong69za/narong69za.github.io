const express = require("express");
const path = require("path");

require("../db/db");

const renderRoute = require("../routes/render");
const statusRoute = require("../routes/status");
const webhookRoute = require("../routes/webhook");

const app = express();

app.use(express.static(path.join(__dirname,"../public")));
app.use("/assets", express.static(path.join(__dirname,"../assets")));

app.get("/",(req,res)=>{
   res.sendFile(path.join(__dirname,"../public/index.html"));
});
