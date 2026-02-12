// =============================
// SN DESIGN SERVER CORE
// Railway Ready Version
// =============================

require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();


// =============================
// CONFIG
// =============================

const PORT = process.env.PORT || 8080;


// =============================
// MIDDLEWARE
// =============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// =============================
// STATIC HTML (ROOT)
// =============================

app.use(express.static(path.join(__dirname)));


// =============================
// API STATUS (SERVER + AI CHECK)
// =============================

app.get("/api/status", (req, res) => {

  res.json({
    server: true,
    ai: true
  });

});


// =============================
// ROUTES (DEBUG SAFE LOAD)
// =============================

try {
  console.log("LOAD API ROUTE");
  app.use("/api", require("./api.route"));
} catch (e) {
  console.error("API ROUTE ERROR:", e);
}

try {
  console.log("LOAD PAYMENT ROUTE");
  app.use("/payment", require("./payment.route"));
} catch (e) {
  console.error("PAYMENT ROUTE ERROR:", e);
}

try {
  console.log("LOAD WEBHOOK ROUTE");
  app.use("/webhook", require("./webhook.route"));
} catch (e) {
  console.error("WEBHOOK ROUTE ERROR:", e);
}


// =============================
// START SERVER
// =============================

app.listen(PORT, () => {
  console.log("SERVER RUNNING:", PORT);
});
