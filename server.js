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

// static html (serve index.html etc)
app.use(express.static(path.join(__dirname)));


// =============================
// ROUTES (แก้ path ให้ตรง root)
// =============================

try {

  app.use("/api", require("./api.route"));
  app.use("/payment", require("./payment.route"));
  app.use("/webhook", require("./webhook.route"));

} catch (err) {

  console.error("Route Load Error:", err.message);

}


// =============================
// TEST ROUTE (กัน 502)
// =============================

app.get("/health", (req, res) => {

  res.json({
    status: "SN DESIGN SERVER OK",
    time: new Date()
  });

});


// =============================
// ROOT
// =============================

app.get("/", (req, res) => {

  res.sendFile(path.join(__dirname, "index.html"));

});


// =============================
// ERROR HANDLER
// =============================

app.use((err, req, res, next) => {

  console.error("SERVER ERROR:", err);

  res.status(500).json({
    error: "Internal Server Error"
  });

});


// =============================
// START SERVER
// =============================

app.listen(PORT, () => {

  console.log(`🔥 SN DESIGN SERVER RUNNING ON PORT ${PORT}`);

});
