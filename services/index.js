// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: services/index.js
// VERSION: v9.1.0
// STATUS: production-final
// LAYER: core-server
// RESPONSIBILITY:
// - initialize express app
// - register middleware
// - register webhook routes (raw first)
// - register protected routes
// DEPENDS ON:
// - config/system.config.js
// - routes/*
// LAST FIX:
// - centralized config usage
// - confirmed webhook raw order
// - production route locking
// =====================================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const cookieParser = require("cookie-parser");

const config = require("../config/system.config");

const adminRoutes = require("../routes/admin.routes");
const stripeRoute = require("../routes/stripe.route");
const stripeWebhook = require("../routes/stripe.webhook");
const userRoutes = require("../routes/user.routes");
const thaiPaymentRoutes = require("../routes/thai-payment.route");
const authRoutes = require("../routes/auth.route");
const promptpayRoute = require("../routes/promptpay.route");
const authMiddleware = require("../middleware/auth");
const omiseRoute = require("../routes/omise.route");
const omiseWebhook = require("../routes/omise.webhook");
const cryptoRoute = require("../routes/crypto.route");
const usageCheck = require("../services/usage-check");
const { create } = require("../controllers/create.controller.js");

const app = express();
app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});

// ================= CORS =================
app.use(cors({
  origin: ["https://sn-designstudio.dev"],
  credentials: true
}));

app.use(cookieParser());

// =====================================================
// 🔴 WEBHOOKS (RAW BODY MUST COME FIRST)
// =====================================================

app.use("/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

app.use("/api/omise/webhook",
  express.raw({ type: "application/json" }),
  omiseWebhook
);

app.use("/api/crypto/webhook",
  express.raw({ type: "application/json" })
);

// =====================================================
// BODY PARSER (AFTER WEBHOOKS)
// =====================================================

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// =====================================================
// ROUTES
// =====================================================

app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/stripe", stripeRoute);
app.use("/api/thai-payment", thaiPaymentRoutes);

app.use("/api/omise", authMiddleware, omiseRoute);
app.use("/api/crypto", authMiddleware, cryptoRoute);
app.use("/api/promptpay", promptpayRoute);

app.use("/auth", authRoutes);

// =====================================================
// RENDER ENGINE
// =====================================================

const upload = multer({
  storage: multer.memoryStorage(),
});

app.post(
  "/api/render",
  authMiddleware,
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

app.get("/", (req, res) => {
  res.send("SN DESIGN API RUNNING");
});

// =====================================================
// START SERVER
// =====================================================

const PORT = process.env.PORT || 10000;

setTimeout(() => {
  app.listen(PORT, () => {
    console.log("ULTRA ENGINE RUNNING:", PORT);
    console.log("SYSTEM MODE:", process.env.NODE_ENV || "production");
  });
}, 3000);
