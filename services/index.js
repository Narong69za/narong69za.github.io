require("dotenv").config();

console.log("RUNWAY ENV:", process.env.RUNWAY_API_KEY);
console.log("GOOGLE ENV:", process.env.GOOGLE_CLIENT_ID);

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { OAuth2Client } = require("google-auth-library");

const adminRoutes = require("./admin.routes");
const stripeRoute = require("../routes/stripe.route");
const stripeWebhook = require("../routes/stripe.webhook");
const { create } = require("../controllers/create.controller.js");

const app = express();

app.use(cors());

// ================= STRIPE WEBHOOK (RAW BODY) =================

app.use(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" })
);

app.use("/api/stripe/webhook", stripeWebhook);

// ================= JSON =================

app.use(express.json());

// ================= ADMIN ROUTES =================

app.use("/api/admin", adminRoutes);

// ================= GOOGLE AUTH =================

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post("/api/auth/google", async (req,res)=>{

  try{

    const { token } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    res.json({
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture
    });

  }catch(err){

    res.status(401).json({ error:"INVALID GOOGLE TOKEN" });

  }

}); // ⭐ ตรงนี้ที่หาย

// ================= STRIPE ROUTES =================

app.use("/api/stripe", stripeRoute);

// ================= UPLOAD =================

const upload = multer({
  storage: multer.memoryStorage()
});

// ================= RENDER =================

app.post("/api/render", upload.any(), create);

// ================= STATUS =================

app.get("/api/status/server",(req,res)=>{
  res.json({ server:"online" });
});

app.get("/api/status/ai",(req,res)=>{
  res.json({ ai:"ready" });
});

app.get("/",(req,res)=>{
  res.send("SN DESIGN API RUNNING");
});

// ================= START SERVER =================

const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{
  console.log("ULTRA ENGINE RUNNING:",PORT);
});
