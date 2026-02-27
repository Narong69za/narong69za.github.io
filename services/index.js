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
const userRoutes = require("../routes/user.routes");
const thaiPaymentRoutes = require("../routes/thai-payment.route");
const usageCheck = require("../services/usage-check");

const { create } = require("../controllers/create.controller.js");
const { googleLogin } = require("../controllers/auth.controller");

const app = express();

// =====================================================
// GLOBAL MIDDLEWARE
// =====================================================

app.use(cors());

// =====================================================
// STRIPE WEBHOOK (RAW BODY FIRST)
// =====================================================

app.use(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" })
);

app.use("/api/stripe/webhook", stripeWebhook);

// =====================================================
// JSON PARSER
// =====================================================

app.use(express.json());

// =====================================================
// ROUTE REGISTER
// =====================================================

app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/stripe", stripeRoute);
app.use("/api/thai-payment", thaiPaymentRoutes);

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
    const user = await googleLogin(payload);

    return res.json(user);

  } catch (err) {

    console.error("GOOGLE AUTH ERROR:", err.message);
    return res.status(401).json({ error: "INVALID GOOGLE TOKEN" });

  }

});

// =====================================================
// FILE UPLOAD
// =====================================================

const upload = multer({
  storage: multer.memoryStorage(),
});

// =====================================================
// RENDER ENGINE
// =====================================================

const usageCheck = require("../services/usage-check");

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
// USER SELF DATA
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
