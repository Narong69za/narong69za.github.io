require("dotenv").config();
const express = require("express"),
      cors = require("cors"),
      multer = require("multer"),
      cookieParser = require("cookie-parser"),
      session = require("express-session"),
      sqlite3 = require('sqlite3').verbose(),
      fs = require('fs'),
      path = require('path'),
      { exec } = require("child_process");

const authMiddleware = require("/home/ubuntu/narong69za.github.io/middleware/auth.js"),
      adminGuard = require("/home/ubuntu/narong69za.github.io/middleware/admin.guard.js");

const pm2 = require('pm2');
const app = express(), FRONTEND_PATH = "/home/ubuntu/narong69za.github.io";

const db = new sqlite3.Database('/root/sn-payment-core/database.db', (err) => {
    if (err) console.error("❌ DB Error:", err.message);
    else console.log("✅ Database Connected: /root/sn-payment-core/database.db");
});

app.use(express.static(FRONTEND_PATH));
app.set("trust proxy", 1);
app.use(cors({ origin: ["https://sn-designstudio.dev", "https://narong69za.github.io"], credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(session({
    secret: process.env.JWT_SECRET || "SN_ULTRA_2026",
    resave: false,
    saveUninitialized: true,
    cookie: { domain: '.sn-designstudio.dev', secure: true, sameSite: 'none', maxAge: 1000 * 60 * 60 }
}));

const safeRequire = (p) => {
    const f = path.join(FRONTEND_PATH, p.endsWith('.js') ? p : p + '.js');
    if (fs.existsSync(f)) {
        try { delete require.cache[require.resolve(f)]; return require(f); } catch (e) { return null; }
    }
    return null;
};

// --- [CORE ROUTES] ---
const adminRoutes = safeRequire("routes/admin.routes"),
      authRoutes = safeRequire("routes/auth.route"),
      stripeRoute = safeRequire("routes/stripe.route"),
      userRoutes = safeRequire("routes/user.routes"),
      thaiPaymentRoutes = safeRequire("routes/thai-payment.route"),
      promptpayRoute = safeRequire("routes/promptpay.route"),
      paymentStatusRoute = safeRequire("routes/payment-status.route"),
      scbRoutes = safeRequire("routes/scb.route"),
      tmnRoutes = safeRequire("routes/truemoney.route"),
      cryptoRoute = safeRequire("routes/crypto.route"),
      usageCheck = safeRequire("services/usage-check");

const { create } = safeRequire("controllers/create.controller") || {};

// --- [DASHBOARD API] ---
app.get("/admin/finance", (req, res) => res.sendFile(path.join(FRONTEND_PATH, "admin/payment.dashboard.html")));

app.get("/api/admin/finance/overview", adminGuard, (req, res) => {
    const sql = "SELECT SUM(amount) as total FROM payments WHERE status IN ('paid','success')";
    db.get(sql, (err, row) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({
            success: true,
            local: { totalCreditSold: row ? (row.total || 0) : 0, activeUsers: 1 },
            partners: { runway: { status: "CONNECTED" }, gemini: { status: "LIVE" }, elevenlabs: { status: "READY" } }
        });
    });
});

// --- [SYSTEM MONITORING] ---
app.get("/api/admin/system-status", (req, res) => {
    exec("python3 /home/ubuntu/sn-payment-core/monitor_api.py", (err, stdout) => {
        let monitorData = { cpu: "0.0", ramUsed: "0.0", diskUsed: "0.0", status: "ONLINE" };
        try { 
            if (stdout) { 
                const data = JSON.parse(stdout.toString().trim()); 
                monitorData.cpu = parseFloat(data.cpu || 0).toFixed(1); 
                monitorData.ramUsed = parseFloat(data.ram || 0).toFixed(1); 
                monitorData.diskUsed = parseFloat(data.disk || 0).toFixed(1); 
            } 
        } catch (e) {}
        db.get("SELECT COUNT(*) as count FROM users", (e, row) => {
            res.json({ success: true, monitor: { ...monitorData, users: row ? row.count : 0, status: "ULTRA_STABLE" } });
        });
    });
});

// --- [BUSINESS ROUTES ACTIVATION] ---
if (adminRoutes) app.use("/api/admin", adminGuard, adminRoutes);
if (userRoutes) app.use("/api/user", userRoutes);
if (promptpayRoute) app.use("/api/promptpay", promptpayRoute);
if (stripeRoute) app.use("/api/stripe", stripeRoute);
if (thaiPaymentRoutes) app.use("/api/thai-payment", thaiPaymentRoutes);
if (cryptoRoute) app.use("/api/crypto", cryptoRoute);
if (paymentStatusRoute) app.use("/api/payment", paymentStatusRoute);
if (scbRoutes) app.use("/api/scb", scbRoutes);
if (tmnRoutes) app.use("/api/truemoney", tmnRoutes);
if (authRoutes) app.use("/auth", authRoutes);

const upload = multer({ storage: multer.memoryStorage() });
if (create) app.post("/api/render", usageCheck, upload.any(), create);

app.get("/", (req, res) => res.send("SN ULTRA ENGINE MASTER ONLINE"));
app.listen(5002, () => console.log("⭐ [MASTER] ONLINE ON PORT 5002"));
