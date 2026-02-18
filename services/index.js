const express = require("express");
const path = require("path");

require("../db/db"); // connect DB

const renderRoute = require("../api/render.route");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname,"../public")));

app.get("/",(req,res)=>{
   res.sendFile(path.join(__dirname,"../public/index.html"));
});

// mount API
app.use("/api", renderRoute);

const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{
   console.log("SERVER RUNNING",PORT);
});
