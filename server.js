const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

// serve root folder (แทน public)
app.use(express.static(__dirname));

app.get("/",(req,res)=>{
   res.sendFile(path.join(__dirname,"index.html"));
});

// ROUTE
const renderRoute = require("./api/render.route");

app.use("/api", renderRoute);

const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{
   console.log("SERVER RUNNING",PORT);
});
