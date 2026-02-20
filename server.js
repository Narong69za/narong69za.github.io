const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/*
=====================================
API ROUTES (LOCK ORDER)
=====================================
*/

const templatesRoute = require("./routes/templates.route");
const renderRoute = require("./api/render.route");
const statusRoute = require("./routes/status"); // ถ้ามี
const webhookRoute = require("./routes/webhook"); // ถ้ามี

// 🔥 preset system
app.use("/api/templates", templatesRoute);

// 🔥 engine run
app.use("/api/render", renderRoute);

// optional
app.use("/api/status", statusRoute);
app.use("/api/webhook", webhookRoute);

/*
=====================================
STATIC (ต้องอยู่ล่างสุด)
=====================================
*/

app.use("/", express.static(__dirname));

app.get("/",(req,res)=>{
   res.sendFile(path.join(__dirname,"index.html"));
});

const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{
   console.log("ULTRA SERVER RUNNING:",PORT);
});
