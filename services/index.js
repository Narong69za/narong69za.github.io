/*
=====================================
SN DESIGN ULTRA ENGINE API
FULL FIX VERSION (ROUTE + RENDER SAFE)
=====================================
*/

const express = require("express");
const cors = require("cors");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();

/* ================= CONFIG ================= */

app.use(cors());
app.use(express.json());

/* STATIC FRONTEND ROOT (ULTRA SAFE) */
app.use(express.static(path.join(__dirname, "../")));

/* ================= ROUTE IMPORTS ================= */

// IMPORTANT: ensure these paths match your real folder structure
const templateRoute = require("../routes/templates.route");
const webhookRoute = require("../routes/webhook.route");

/* ================= ROUTE REGISTER ================= */

// FIX: this was missing (causing 404 on /api/template/*)
app.use("/api/template", templateRoute);
app.use("/api/webhook", webhookRoute);

/* ================= HEALTH CHECK ================= */

app.get("/", (req, res) => {
   res.send("SN DESIGN API ONLINE");
});

/* ================= MEMORY STORE (TEMP - IF STILL USED) ================= */

const jobs = {};

/* ================= RENDER ROUTE ================= */

/*
NOTE:
ถ้าคุณมี jobQueue / worker อยู่แล้ว
สามารถเปลี่ยน runEngine ไปเชื่อมระบบนั้นได้
ตอนนี้แก้เฉพาะ wiring ไม่ยุ่ง architecture
*/

const { runEngine } = require("../engine/motionEngine");

app.post("/api/render", async (req, res) => {

   try {

      const jobID = uuidv4();

      const data = {
         ...req.body,
         jobID
      };

      jobs[jobID] = {
         status: "processing",
         progress: 0
      };

      runEngine(data)
         .then(() => {
            jobs[jobID].status = "complete";
            jobs[jobID].progress = 100;
         })
         .catch(err => {
            console.log("ENGINE ERROR:", err);
            jobs[jobID].status = "error";
         });

      res.json({
         success: true,
         jobID
      });

   } catch (e) {

      console.log("RENDER FAIL:", e);

      res.status(500).json({
         error: "ENGINE FAIL"
      });

   }

});

/* ================= STATUS ROUTE ================= */

app.get("/api/status/:id", (req, res) => {

   const job = jobs[req.params.id];

   if (!job) {
      return res.json({
         status: "not_found",
         progress: 0
      });
   }

   res.json(job);

});

/* ================= PORT BIND ================= */

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
   console.log("SN DESIGN API RUNNING ON PORT:", PORT);
});
