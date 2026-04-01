require("dotenv").config();
const express = require("express"), 
      cors = require("cors"), 
      multer = require("multer"), 
      cookieParser = require("cookie-parser"),
      session = require("express-session"); // [ADDED] ระบบ Session สำหรับ Google Auth

const fs = require('fs'), 
      path = require('path'), 
      { exec } = require("child_process"), 
      dbModule = require("../db/db");

const authMiddleware = require("../middleware/auth"), 
      adminGuard = require("../middleware/admin.guard");

// [MASTER] Import pm2
const pm2 = require('pm2');

const app = express(), FRONTEND_PATH = "/home/ubuntu/narong69za.github.io";
const db = dbModule.sqlite || dbModule;

// [MASTER CONFIG] ตั้งค่า Trust Proxy สำหรับการรันหลัง Coolify/Docker
app.set("trust proxy", 1);

const safeRequire = (p) => {
    const f = path.join(FRONTEND_PATH, p.endsWith('.js') ? p : p + '.js');
    if (fs.existsSync(f)) {
        try { delete require.cache[require.resolve(f)]; return require(f); } catch (e) { return null; }
    }
    return null;
};

const adminRoutes = safeRequire("routes/admin.routes"), 
      authRoutes = safeRequire("routes/auth.route"), 
      stripeRoute = safeRequire("routes/stripe.route");
const userRoutes = safeRequire("routes/user.routes"), 
      thaiPaymentRoutes = safeRequire("routes/thai-payment.route"), 
      promptpayRoute = safeRequire("routes/promptpay.route");
const paymentStatusRoute = safeRequire("routes/payment-status.route"), 
      scbRoutes = safeRequire("routes/scb.route"),
      tmnRoutes = safeRequire("routes/truemoney.route"),
      cryptoRoute = safeRequire("routes/crypto.route"), 
      usageCheck = safeRequire("services/usage-check");
const { create } = safeRequire("controllers/create.controller") || {};

// =====================================================
// [ZONE: MIDDLEWARES]
// =====================================================

// [ADDED] แก้ไขปัญหา INVALID_OAUTH_STATE โดยการใช้ Session ข้ามโดเมน
app.use(session({
    secret: process.env.JWT_SECRET || "SN_ULTRA_ENGINE_2026_SECURE_KEY",
    resave: false,
    saveUninitialized: true,
    cookie: { 
        domain: '.sn-designstudio.dev', // บังคับให้ Cookie ใช้ได้ทั้งหน้าบ้านและ API
        secure: true,                   // ต้องเป็น true เพราะใช้ HTTPS
        sameSite: 'none',               // อนุญาตให้ Google ส่งค่ากลับมาหาเราได้
        maxAge: 1000 * 60 * 60          // อายุ 1 ชั่วโมง
    }
}));

app.use(cors({ 
    origin: ["https://sn-designstudio.dev", "https://narong69za.github.io"], 
    credentials: true 
}));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// =====================================================
// [ZONE: MONITORING APIs]
// =====================================================

// 1. ระบบ Monitor เดิม (Python)
app.get("/api/admin/system-status", (req, res) => {
    exec("python3 /home/ubuntu/sn-payment-core/monitor_api.py", (err, stdout) => {
        let monitorData = { cpu: "0.0", ramUsed: "0.0", diskUsed: "0.0", status: "ONLINE" };
        try { if (stdout) { const data = JSON.parse(stdout.toString().trim()); monitorData.cpu = parseFloat(data.cpu || 0).toFixed(1); monitorData.ramUsed = parseFloat(data.ram || 0).toFixed(1); monitorData.diskUsed = parseFloat(data.disk || 0).toFixed(1); } } catch (e) {}
        if (db && typeof db.get === 'function') {
            db.get("SELECT COUNT(*) as count FROM users", (e, row) => {
                res.json({ success: true, monitor: { ...monitorData, users: row ? row.count : 0, status: "ULTRA_STABLE" } });
            });
        } else { res.json({ success: true, monitor: { ...monitorData, users: "N/A", db_status: "CHECK_EXPORT" } }); }
    });
});

// 2. [NEW] ระบบ Real-time PM2 Monitor
app.get("/api/admin/realtime-status", (req, res) => {
    pm2.connect((err) => {
        if (err) return res.status(500).json({ success: false, error: "PM2 Connection Failed" });

        pm2.list((err, list) => {
            pm2.disconnect();
            if (err) return res.status(500).json({ success: false, error: "Failed to fetch process list" });

            const services = list.map(proc => ({
                name: proc.name,
                status: proc.pm2_env.status,
                cpu: proc.monit ? proc.monit.cpu : 0,
                memory: proc.monit ? Math.round(proc.monit.memory / 1024 / 1024) : 0,
                uptime: proc.pm2_env.pm_uptime ? (Date.now() - proc.pm2_env.pm_uptime) : 0,
                restarts: proc.pm2_env.restart_time
            }));
            res.json({ success: true, services });
        });
    });
});

// =====================================================
// [ZONE: BUSINESS ROUTES]
// =====================================================

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

app.get("/healthz", (req, res) => res.status(200).send("OK"));
app.get("/", (req, res) => res.send("SN ULTRA ENGINE MASTER ONLINE"));

app.listen(5002, () => console.log("⭐ [MASTER] ONLINE ON PORT 5002"));

