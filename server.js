const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/*
=====================================
ROUTES
=====================================
*/

const renderRoute = require("./api/render.route");
const templatesRoute = require("./routes/templates.route");

app.use("/api", renderRoute);
app.use("/api/templates", templatesRoute);

/*
=====================================
STATIC FILES (ต้องอยู่ล่างสุด)
=====================================
*/

app.use("/", express.static(__dirname));

app.get("/",(req,res)=>{
   res.sendFile(path.join(__dirname,"index.html"));
});

const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{
   console.log("SERVER RUNNING",PORT);
});
