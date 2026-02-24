/**
 * server.js
 * FULL VERSION
 * SN DESIGN STUDIO ENGINE SERVER
 */

require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const MODEL_ROUTER = require("./services/model.router");

// RUNWAY POLLER
const runwayPoller = require("./services/runwayml/v1/runway.poller");

const app = express();


// =========================
// BASIC CONFIG
// =========================

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));


// =========================
// STATIC FRONTEND
// =========================

app.use(express.static(path.join(__dirname, "public")));


// =========================
// STATUS ROUTE
// =========================

app.get("/api/status", (req, res) => {

  res.json({
    status: "ok",
    service: "SN DESIGN ENGINE AI",
    time: new Date().toISOString()
  });

});


// =========================
// CREATE JOB ROUTE
// =========================

app.post("/api/create", async (req, res) => {

  try {

    const {
      engine,
      mode,
      prompt,
      fileAUrl,
      fileBUrl
    } = req.body;

    const result = await MODEL_ROUTER.run({

      engine,
      mode,
      prompt,

      files: {
        fileAUrl,
        fileBUrl
      }

    });

    res.json({
      success: true,
      data: result
    });

  } catch (err) {

    console.error("CREATE ERROR:", err.message);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

});


// =========================
// ROOT
// =========================

app.get("/", (req, res) => {
  res.send("SN DESIGN ENGINE AI SERVER RUNNING");
});


// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(`🚀 SN DESIGN ENGINE AI RUNNING ON PORT ${PORT}`);

  // START RUNWAY BACKGROUND POLLER
  runwayPoller.start();

});
