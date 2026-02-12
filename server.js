/*
=====================================
SN DESIGN STUDIO — ULTRA SERVER CORE
CRASH FIX VERSION
ADD ONLY SAFE BUILD
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
// AI PROVIDER
// =============================

let replicate = null;

try {

  if(process.env.REPLICATE_API_TOKEN){

    replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

  }

}catch(e){

  console.log("AI INIT ERROR");

}


// =============================
// MIDDLEWARE
// =============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// =============================
// STATIC
// =============================

app.use(express.static(path.join(__dirname)));


// =============================
// STATUS API (SAFE)
// =============================

app.get("/api/status",(req,res)=>{

res.json({
  server:true,
  ai: !!replicate
});

});


// =============================
// ROUTES
// =============================

app.use("/api", require("./api.route"));
app.use("/payment", require("./payment.route"));
app.use("/webhook", require("./webhook.route"));


// =============================
// START
// =============================

app.listen(PORT, () => {

console.log("🔥 SERVER ONLINE:", PORT);

});
