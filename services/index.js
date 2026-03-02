// =====================================================
// SN DESIGN ENGINE AI
// ULTRA ENGINE SERVER
// VERSION: 2.6.0
// STATUS: production
// LAST FIX: attach authMiddleware to OMISE route (JWT protected)
// =====================================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const cookieParser = require("cookie-parser");

// =====================================================
// ROUTES
// =====================================================

const adminRoutes = require("../routes/admin.routes");
const stripeRoute = require("../routes/stripe.route");
const stripeWebhook = require("../routes/stripe.webhook");
const userRoutes = require("../routes/user.routes");
const thaiPaymentRoutes = require("../routes/thai-payment.route");
const authRoutes = require("../routes/auth.route");
const promptpayRoute = require("../routes/promptpay.route");

// 🔥 AUTH
const authMiddleware = require("../middleware/auth");

// 🔥 ADD OMISE
const omiseRoute = require("../routes/omise.route");
const omiseWebhook = require("../routes/omise.webhook");

const usageCheck = require("../services/usage-check");
const { create } = require("../controllers/create.controller.js");

const app = express();

// =====================================================
// CORS
// =====================================================

app.use(cors({
  origin: ["https://sn-designstudio.dev"],
  credentials: true
}));

app.use(cookieParser());

// =====================================================
// 🔴 STRIPE WEBHOOK (RAW BODY FIRST)
// =====================================================

app.use(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" })
);

app.use("/api/stripe/webhook", stripeWebhook);

// =====================================================
// 🔴 OMISE WEBHOOK (RAW BODY REQUIRED)
// =====================================================

app.use(
  "/api/omise/webhook",
  express.raw({ type: "application/json" })
);

// =====================================================
// BODY PARSER (AFTER WEBHOOKS)
// =====================================================

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// =====================================================
// ROUTE REGISTER
// =====================================================

app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/stripe", stripeRoute);
app.use("/api/thai-payment", thaiPaymentRoutes);

// 🔥 PROTECTED OMISE ROUTE (JWT REQUIRED)
app.use("/api/omise", authMiddleware, omiseRoute);

// 🔥 OMISE WEBHOOK (NO AUTH)
app.use("/api/omise/webhook", omiseWebhook);

app.use("/api/promptpay", promptpayRoute);

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
  console.log("OMISE KEY LOADED:", !!process.env.OMISE_SECRET_KEY);
  console.log("ULTRA ENGINE RUNNING:", PORT);
});
