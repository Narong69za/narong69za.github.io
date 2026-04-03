// =====================================================
// [FRONTEND LOGIC] controllers/create.controller.js
// VERSION: v10.1.0 (THE DEFINITIVE DATA SYNC)
// =====================================================
const { v4: uuidv4 } = require("uuid");
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = '/home/ubuntu/sn-payment-core/database.db';
const FRONTEND_PATH = "/home/ubuntu/narong69za.github.io";
// ตรวจสอบทั้ง 'assets' และ 'Assets' เพื่อความชัวร์
const DATA_FILE = fs.existsSync(path.join(FRONTEND_PATH, "assets/js/engine.data.js")) 
    ? path.join(FRONTEND_PATH, "assets/js/engine.data.js")
    : path.join(FRONTEND_PATH, "Assets/js/engine.data.js");

const db = new sqlite3.Database(DB_PATH);

// --- ระบบดึงข้อมูลแบบใหม่ (สะอาดและแม่นยำที่สุด) ---
const getMasterConfig = (alias) => {
    try {
        let content = fs.readFileSync(DATA_FILE, 'utf8');
        
        // แปลง 'export const' เป็น 'var' เพื่อให้ eval อ่านค่าได้ทุกตัวในก้อนเดียว
        const scriptToEval = content.replace(/export const /g, 'var ') + 
                             "\n; ({ ENGINE_DATA, CTA_MODEL_MASTER });";
        
        const { ENGINE_DATA, CTA_MODEL_MASTER } = eval(scriptToEval);

        if (!CTA_MODEL_MASTER || !ENGINE_DATA) return null;

        // ค้นหา ID จาก Alias
        const entry = Object.entries(CTA_MODEL_MASTER).find(([k, v]) => v.alias === alias);
        if (!entry) return null;

        const [id, ctaInfo] = entry;
        const technical = ENGINE_DATA[id];

        if (!technical) return null;

        return {
            provider: technical.provider,
            modelId: technical.model,
            endpoint: technical.endpoint,
            cost: ctaInfo.cost || 10,
            alias: alias
        };
    } catch (e) {
        console.error("❌ SYNC ERROR:", e.message);
        return null;
    }
};

exports.create = async (req, res) => {
    try {
        const { alias, prompt, is_test, master_key } = req.body;

        // 1. Auth Bypass
        const user = (master_key === "SN_ULTRA_2026_SECRET") ? { id: "ADMIN-TERMINAL" } : req.user;
        if (!user) return res.status(401).json({ error: "UNAUTHORIZED" });

        // 2. ดึง Config
        const config = getMasterConfig(alias);
        if (!config) return res.status(404).json({ error: `ALIAS_${alias}_NOT_FOUND_IN_ENGINE_DATA` });

        const jobId = is_test ? `TEST-${uuidv4().slice(0,8)}` : `JOB-${uuidv4().slice(0,8)}`;

        // 3. Sandbox Mode
        if (is_test === true || is_test === "true") {
            db.run("INSERT INTO jobs (id, user_id, engine, prompt, cost, status) VALUES (?,?,?,?,?,?)", 
            [jobId, user.id, config.provider, `[TEST] ${prompt}`, 0, 'test_success']);
            
            return res.json({ status: "success", mode: "sandbox", jobId, engine: config.provider, model: config.modelId });
        }

        // 4. Production Mode
        db.serialize(() => {
            db.run("UPDATE admin_stocks SET remaining_stock = remaining_stock - 1 WHERE service_name = ?", [config.provider]);
            db.run("INSERT INTO jobs (id, user_id, engine, prompt, cost, status) VALUES (?,?,?,?,?,?)", 
            [jobId, user.id, config.provider, prompt, config.cost, 'success']);
        });

        res.json({ status: "success", jobId, engine: config.provider });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
