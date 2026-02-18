const express = require("express");
const path = require("path");

require("../db/db");

const renderRoute = require("../api/render.route");

const app = express();

app.use(express.json());

// serve root index.html
app.get("/",(req,res)=>{
   res.sendFile(path.join(__dirname,"../index.html"));
});

// mount API
app.use("/api", renderRoute);

const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{
   console.log("SERVER RUNNING",PORT);
});
