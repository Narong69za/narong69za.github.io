// =====================================================
// SN DESIGN ENGINE AI
// ULTRA ENGINE SERVER - AUTH INTEGRATION VERSION
// =====================================================

require("dotenv").config();

console.log("RUNWAY ENV:", process.env.RUNWAY_API_KEY ? "OK" : "MISSING");
console.log("GOOGLE ENV:", process.env.GOOGLE_CLIENT_ID ? "OK" : "MISSING");

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const cookieParser = require("cookie-parser");

// =====================================================
// ROUTES / SERVICES / CONTROLLERS
// =====================================================

const adminRoutes = require("../routes/admin.routes");
const stripeRoute = require("../routes/stripe.route");
const stripeWebhook = require("../routes/stripe.webhook");
const userRoutes = require("../routes/user.routes");
const thaiPaymentRoutes = require("../routes/thai-payment.route");
const authRoutes = require("../routes/auth.route");

const usageCheck = require("../services/usage-check");

const { create } = require("../controllers/create.controller.js");

const app = express();

// =====================================================
// GLOBAL MIDDLEWARE
// =====================================================

app.use(cors({
  origin: [
    "https://sn-designstudio.dev"
  ],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// STRIPE WEBHOOK (RAW BODY FIRST)
// =====================================================

app.use(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" })
);

app.use("/api/stripe/webhook", stripeWebhook);

// =====================================================
// ROUTE REGISTER
// =====================================================

app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/stripe", stripeRoute);
app.use("/api/thai-payment", thaiPaymentRoutes);

// 🔐 AUTH ROUTES (NEW)
app.use("/auth", authRoutes);

// =====================================================
// FILE UPLOAD
// =====================================================

const upload = multer({
  storage: multer.memoryStorage(),
});

// =====================================================
// RENDER ENGINE
// =====================================================

app.post(
  "/api/render",
  usageCheck,
  upload.any(),
  create
);

// =====================================================
// STATUS
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
