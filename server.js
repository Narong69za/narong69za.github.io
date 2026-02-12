/*
=====================================
SN DESIGN STUDIO — ULTRA SERVER CORE
FINAL LOCK BUILD
ADD ONLY VERSION
=====================================
*/

require("dotenv").config();

const express = require("express");
const path = require("path");
const Replicate = require("replicate");

const app = express();


// =============================
// CONFIG
// =============================

const PORT = process.env.PORT || 8080;


// =============================
// AI PROVIDER (REPLICATE)
// =============================

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});


// =============================
// MIDDLEWARE
// =============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// =============================
// STATIC WEBSITE
// =============================

app.use(express.static(path.join(__dirname)));


// =============================
// ULTRA LIVE STATUS API
// REAL SERVER + REAL AI CHECK
// =============================

app.get("/api/status", async (req,res)=>{

let aiStatus=false;

try{

  // test replicate connection
  await replicate.models.list();

  aiStatus=true;

}catch(e){

  aiStatus=false;

}

res.json({
  server:true,
  ai:aiStatus
});

});


// =============================
// ROUTES (LOCKED)
// =============================

app.use("/api", require("./api.route"));
app.use("/payment", require("./payment.route"));
app.use("/webhook", require("./webhook.route"));


// =============================
// START SERVER
// =============================

app.listen(PORT, () => {
  console.log("🔥 SN DESIGN SERVER ONLINE — PORT:", PORT);
});
