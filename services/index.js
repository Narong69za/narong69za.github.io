// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: services/index.js
// VERSION: v
// STATUS: production-final
// LAYER: core-server
// RESPONSIBILITY:
// - initialize express app
// - register middleware
// - secure admin routes
// - register webhooks (raw first)
// DEPENDS ON:
// - middleware/auth.js
// - middleware/admin.guard.js
// - routes/*
// LAST FIX: 2026-03-08
// - removed delayed listen
// - secured admin routes
// - fixed crypto webhook registration
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
const adminGuard = require("../middleware/admin.guard");
const omiseRoute = require("../routes/omise.route");
const omiseWebhook = require("../routes/omise.webhook");
const cryptoRoute = require("../routes/crypto.route");
const cryptoWebhook = require("../routes/crypto.webhook");
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

// ================= WEBHOOKS =================
// MUST COME BEFORE JSON PARSER

app.use("/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

app.use("/api/omise/webhook",
  express.raw({ type: "application/json" }),
  omiseWebhook
);

app.use("/api/crypto/webhook",
  express.raw({ type: "application/json" }),
  cryptoWebhook
);

// ================= BODY PARSER =================

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ================= ROUTES =================

// 🔒 Admin protected
app.use("/api/admin",
  authMiddleware,
  adminGuard,
  adminRoutes
);

// User APIs
app.use("/api/user", authMiddleware, userRoutes);

app.use("/api/stripe", authMiddleware, stripeRoute);
app.use("/api/thai-payment", authMiddleware, thaiPaymentRoutes);

app.use("/api/omise", authMiddleware, omiseRoute);
app.use("/api/crypto", authMiddleware, cryptoRoute);

app.use("/api/promptpay", authMiddleware, promptpayRoute);

app.use("/auth", authRoutes);

// ================= RENDER ENGINE =================

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

// ================= STATUS =================

app.get("/api/status/server", (req, res) => {
  res.json({ server: "online" });
});

app.get("/", (req, res) => {
  res.send("SN DESIGN API RUNNING");
});

// ================= START =================

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("ULTRA ENGINE RUNNING:", PORT);
  console.log("SYSTEM MODE:", process.env.NODE_ENV || "production");
});
