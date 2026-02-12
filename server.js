// =============================
// SN DESIGN SERVER CORE
// FINAL SAFE VERSION
// =============================

require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 8080;

// =============================
// MIDDLEWARE
// =============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static html
app.use(express.static(path.join(__dirname)));


// =============================
// API STATUS (SERVER + AI CHECK)
// =============================

app.get("/api/status",(req,res)=>{

res.json({
server:true,
ai:true
});

});


// =============================
// ROUTES SAFE LOAD
// =============================

try {
  console.log("LOAD API ROUTE");
  app.use("/api", require("./api.route"));
} catch(e){
  console.error("API ROUTE ERROR", e);
}

try {

  if(process.env.OMISE_PUBLIC && process.env.OMISE_SECRET){

    console.log("LOAD PAYMENT ROUTE");
    app.use("/payment", require("./payment.route"));

  }else{

    console.log("PAYMENT DISABLED (NO OMISE KEY)");

  }

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
