require("dotenv").config();

const express = require("express");
const path = require("path");

const { generate } = require("./ai.service"); // ใช้ test AI

const app = express();

const PORT = process.env.PORT || 8080;


// =============================
// MIDDLEWARE
// =============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname)));


// =============================
// LIVE STATUS CHECK (REAL)
// =============================

app.get("/api/status", async (req,res)=>{

let aiStatus = false;

try{

// test call
await generate();

aiStatus = true;

}catch(e){

aiStatus = false;

}

res.json({
server:true,
ai:aiStatus
});

});


// =============================
// ROUTES
// =============================

try {
  console.log("LOAD API ROUTE");
  app.use("/api", require("./api.route"));
} catch(e){
  console.error("API ROUTE ERROR", e);
}

try {
  console.log("LOAD PAYMENT ROUTE");
  app.use("/payment", require("./payment.route"));
} catch(e){
  console.error("PAYMENT ROUTE ERROR", e);
}

try {
  console.log("LOAD WEBHOOK ROUTE");
  app.use("/webhook", require("./webhook.route"));
} catch(e){
  console.error("WEBHOOK ROUTE ERROR", e);
}


// =============================
// START SERVER
// =============================

app.listen(PORT, () => {
  console.log("SERVER RUNNING:", PORT);
});
