require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static
app.use(express.static(path.join(__dirname)));


// =========================
// ULTRA STATUS ENGINE LOCK
// ADD ONLY - DO NOT DELETE
// =========================

const aiService = require("./ai.service");


// =========================
// STATUS ENGINE (REAL CHECK)
// =========================

app.get("/api/status", async (req,res)=>{

let aiStatus = false;

try{

// test AI connection (replicate)
await aiService.generate();
aiStatus = true;

}catch(e){

console.error("AI STATUS ERROR:", e);
aiStatus = false;

}

res.json({
server:true,
ai: aiStatus,
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
