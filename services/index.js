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

// =====================================================
// ROUTES
// =====================================================

const adminRoutes = require("./admin.routes");
const stripeRoute = require("../routes/stripe.route");
const stripeWebhook = require("../routes/stripe.webhook");

// ⭐ USER ROUTE (Dashboard / Credit API)
const userRoutes = require("../routes/user.routes");

// ⭐ FREE LIMIT CHECK (ADD ONLY)
const usageCheck = require("../services/usage-check");

// ⭐ ADD ONLY — THAI PAYMENT ROUTE (PromptPay + TrueMoney)
const thaiPaymentRoutes = require("../routes/thai-payment.route");

// =====================================================
// CONTROLLERS
// =====================================================

const { create } = require("../controllers/create.controller.js");

// ⭐ AUTO USER LOGIN STATE
const { googleLogin } = require("../controllers/auth.controller");

// =====================================================

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
// USER ROUTES (DASHBOARD)
// =====================================================

app.use("/api/user", userRoutes);

// =====================================================
// THAI PAYMENT ROUTES (ADD ONLY)
// =====================================================

app.use("/api/thai-payment", thaiPaymentRoutes);

// =====================================================
// GOOGLE AUTH (AUTO USER CREATE + LOGIN STATE)
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

    // AUTO CREATE USER + LOGIN STATE
    const user = await googleLogin(payload);

    return res.json(user);

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

// ⭐ ADD usageCheck ก่อน create
app.post(
  "/api/render",
  usageCheck,
  upload.any(),
  create
);

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
// USER SELF DATA (ADD ONLY)
// =====================================================

const authService = require("./auth.service");
const db = require("../db/db");

app.get("/api/user/me", async (req,res)=>{

    try{

        const user = await authService.check(req);

        db.get(
            "SELECT id,email,credits FROM users WHERE id=?",
            [user.id],
            (err,row)=>{

                if(err) return res.status(500).json({error:"DB ERROR"});

                res.json(row || { id:user.id, credits:0 });

            }
        );

    }catch(err){

        res.status(401).json({error:"AUTH FAIL"});

    }

});

// =====================================================
// START SERVER
// =====================================================

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("ULTRA ENGINE RUNNING:", PORT);
});
