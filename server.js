require("dotenv").config();

const express = require("express");
const path = require("path");

const { generate, getAIStatus } = require("./ai.service");

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static
app.use(express.static(path.join(__dirname)));


// =========================
// AI HEARTBEAT INIT (ADD ONLY)
// =========================

async function initAI(){

  try{

    console.log("AI INIT CHECK");

    const result = await generate();

    console.log("AI STATUS:", result);

  }catch(e){

    console.error("AI INIT ERROR");

  }

}

initAI();


// =========================
// STATUS ENGINE (UPDATED)
// =========================

app.get("/api/status",(req,res)=>{

res.json({
server:true,
ai:getAIStatus(),
payment:false
});

});


// =========================
// NETWORK TRAFFIC MOCK
// =========================

app.get("/api/network",(req,res)=>{

res.json({
traffic: Math.floor(Math.random()*100),
status:"ACTIVE"
});

});


// =========================
// ROUTES SAFE LOAD
// =========================

try{
console.log("LOAD API ROUTE");
app.use("/api", require("./api.route"));
}catch(e){
console.error("API ROUTE ERROR", e);
}

try{
console.log("LOAD PAYMENT ROUTE");
app.use("/payment", require("./payment.route"));
}catch(e){
console.error("PAYMENT ROUTE ERROR", e);
}

try{
console.log("LOAD WEBHOOK ROUTE");
app.use("/webhook", require("./webhook.route"));
}catch(e){
console.error("WEBHOOK ROUTE ERROR", e);
}


// =========================
// START SERVER
// =========================

app.listen(PORT, () => {
console.log("SERVER RUNNING:", PORT);
});
