require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/*
================================
STATIC WEBSITE (ROOT HTML)
================================
*/
app.use(express.static(__dirname));

/*
================================
API ROUTES
================================
*/

const apiRouter = require("./api/api.route");

app.use("/api", apiRouter);

/*
================================
HEALTH CHECK
================================
*/

app.get("/health", (req,res)=>{
   res.json({status:"SN DESIGN SERVER OK"});
});

/*
================================
START SERVER
================================
*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
   console.log("Server running on port",PORT);
});
