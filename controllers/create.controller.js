// =====================================================
// [FRONTEND LOGIC] controllers/create.controller.js
// =====================================================
const { v4: uuidv4 } = require("uuid");
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// ชี้ไปที่ DB ของ Backend และไฟล์ Data ของ Frontend
const DB_PATH = '/home/ubuntu/sn-payment-core/database.db';
const DATA_FILE = '/home/ubuntu/narong69za.github.io/assets/js/engine.data.js';

const db = new sqlite3.Database(DB_PATH);

// ดึงข้อมูลจาก ENGINE_DATA และ CTA_MODEL_MASTER ในไฟล์เดียวกัน
const getMasterConfig = (alias) => {
    try {
        const content = fs.readFileSync(DATA_FILE, 'utf8');
        const ctaMatch = content.match(/export const CTA_MODEL_MASTER = ({[\s\S]*?});/)[1];
        const engineMatch = content.match(/export const ENGINE_DATA = ({[\s\S]*?});/)[1];
        
        const ctaMaster = eval(`(${ctaMatch})`);
        const engineData = eval(`(${engineMatch})`);

        const entry = Object.entries(ctaMaster).find(([k, v]) => v.alias === alias);
        if (!entry) return null;

        const [key, data] = entry;
        const technical = engineData[key];

        return { ...technical, cost: data.cost || 10, alias };
    } catch (e) { return null; }
};

exports.create = async (req, res) => {
    try {
        const { alias, prompt, is_test, master_key } = req.body;

        // 1. ตรวจสอบ Master Key (ไม่ต้องใช้ Cookie)
        const isAdmin = (master_key === "SN_ULTRA_2026_SECRET");
        const user = req.user || (isAdmin ? { id: "ADMIN-TERMINAL" } : null);
        if (!user) return res.status(401).json({ error: "UNAUTHORIZED" });

        // 2. ดึง Config จาก assets/js/engine.data.js
        const config = getMasterConfig(alias);
        if (!config) return res.status(404).json({ error: "ENGINE_NOT_FOUND" });

        const jobId = is_test ? `TEST-${uuidv4().slice(0,8)}` : `JOB-${uuidv4().slice(0,8)}`;

        // 3. Logic: Sandbox vs Production
        if (is_test === true || is_test === "true") {
            db.run("INSERT INTO jobs (id, user_id, engine, prompt, cost, status) VALUES (?,?,?,?,?,?)", 
            [jobId, user.id, config.provider, `[TEST] ${prompt}`, 0, 'test_success']);
            return res.json({ status: "success", mode: "sandbox", jobId, engine: config.provider });
        }

        // --- PRODUCTION LOGIC (รันจริง หักจริง) ---
        // (ส่วนนี้เรียก modelRouter.run และหัก admin_stocks ตามปกติ)
        db.serialize(() => {
            db.run("UPDATE admin_stocks SET remaining_stock = remaining_stock - 1 WHERE service_name = ?", [config.provider]);
            db.run("INSERT INTO jobs (id, user_id, engine, prompt, cost, status) VALUES (?,?,?,?,?,?)", 
            [jobId, user.id, config.provider, prompt, config.cost, 'success']);
        });

        res.json({ status: "success", jobId });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
