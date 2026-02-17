const express = require("express");
const path = require("path");

require("../db/db");

const renderRoute = require("../routes/render");
const statusRoute = require("../routes/status");
const webhookRoute = require("../routes/webhook");

const app = express();

app.use(express.static(path.join(__dirname,"../public")));

app.get("/",(req,res)=>{
   res.sendFile(path.join(__dirname,"../public/index.html"));
});

app.use(express.json());

app.use("/api/render", renderRoute);
app.use("/api/status", statusRoute);
app.use("/api/webhook", webhookRoute);

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
   console.log("ULTRA ENGINE LIVE ON:", PORT);
});
