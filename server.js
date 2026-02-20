const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/*
=====================================
ROUTES (เรียงเฉพาะก่อน)
=====================================
*/

const templatesRoute = require("./routes/templates.route");
const renderRoute = require("./api/render.route");

app.use("/api/templates", templatesRoute);
app.use("/api/render", renderRoute);

/*
=====================================
STATIC
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
