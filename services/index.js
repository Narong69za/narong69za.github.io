// =====================================================
// SN DESIGN ENGINE AI
// ULTRA ENGINE SERVER - CLEAN STABLE VERSION
// =====================================================

require("dotenv").config();

console.log("RUNWAY ENV:", process.env.RUNWAY_API_KEY ? "OK" : "MISSING");
console.log("GOOGLE ENV:", process.env.GOOGLE_CLIENT_ID ? "OK" : "MISSING");

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { OAuth2Client } = require("google-auth-library");

// ROUTES
const adminRoutes = require("./admin.routes");
const stripeRoute = require("../routes/stripe.route");
const stripeWebhook = require("../routes/stripe.webhook");

// CONTROLLERS
const { create } = require("../controllers/create.controller.js");

const app = express();

// =====================================================
// GLOBAL MIDDLEWARE
// =====================================================

app.use(cors());

// =====================================================
// STRIPE WEBHOOK (RAW BODY FIRST - IMPORTANT)
// =====================================================

app.use(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" })
);

app.use("/api/stripe/webhook", stripeWebhook);

// =====================================================
// JSON PARSER (AFTER RAW WEBHOOK)
// =====================================================

app.use(express.json());

// =====================================================
// ADMIN ROUTES
// =====================================================

app.use("/api/admin", adminRoutes);

// =====================================================
// GOOGLE AUTH
// =====================================================

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post("/api/auth/google", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Missing token" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    return res.json({
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    });

  } catch (err) {
    console.error("GOOGLE AUTH ERROR:", err.message);
    return res.status(401).json({ error: "INVALID GOOGLE TOKEN" });
  }
});

// =====================================================
// STRIPE ROUTES (NORMAL JSON ROUTES)
// =====================================================

app.use("/api/stripe", stripeRoute);

// =====================================================
// FILE UPLOAD
// =====================================================

const upload = multer({
  storage: multer.memoryStorage(),
});

// =====================================================
// RENDER ENGINE
// =====================================================

app.post("/api/render", upload.any(), create);

// =====================================================
// STATUS CHECK
// =====================================================

app.get("/api/status/server", (req, res) => {
  res.json({ server: "online" });
});

app.get("/api/status/ai", (req, res) => {
  res.json({ ai: "ready" });
});

app.get("/", (req, res) => {
  res.send("SN DESIGN API RUNNING");
});

// =====================================================
// START SERVER
// =====================================================

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("ULTRA ENGINE RUNNING:", PORT);
});
