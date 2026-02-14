require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 8080;

// =========================
// LOAD AI SERVICE
// =========================

const AI = require("./ai.service");

// =========================
// MIDDLEWARE
// =========================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static
app.use(express.static(path.join(__dirname)));


// =========================
// STATUS ENGINE (REAL)
// =========================

app.get("/api/status", async (req,res)=>{

let aiStatus = false;

try{

await AI.generate(); // heartbeat test
aiStatus = AI.getAIStatus();

}catch(e){
aiStatus = false;
}

res.json({
server:true,
ai:aiStatus,
payment:false
});

});


// =========================
// NETWORK TRAFFIC
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
