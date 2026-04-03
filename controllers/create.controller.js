// =====================================================
// [FRONTEND LOGIC] controllers/create.controller.js
// VERSION: v10.5.0 (THE BULLETPROOF SYNC)
// =====================================================
const { v4: uuidv4 } = require("uuid");
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = '/home/ubuntu/sn-payment-core/database.db';
const FRONTEND_PATH = "/home/ubuntu/narong69za.github.io";

// ตรวจสอบทั้ง 'assets' และ 'Assets' (Case-Sensitive Check)
const getDataFilePath = () => {
    const paths = [
        path.join(FRONTEND_PATH, "assets/js/engine.data.js"),
        path.join(FRONTEND_PATH, "Assets/js/engine.data.js"),
        path.join(FRONTEND_PATH, "assets/js/cta.model.master.js")
    ];
    return paths.find(p => fs.existsSync(p));
};

const db = new sqlite3.Database(DB_PATH);

// --- ระบบดึงข้อมูลแบบ "กวาดหาจริง" ---
const getEngineConfig = (targetAlias) => {
    try {
        const filePath = getDataFilePath();
        if (!filePath) return null;
        const content = fs.readFileSync(filePath, 'utf8');

        // แปลงไฟล์เป็น Object ด้วยวิธีจำลอง Environment
        const script = content.replace(/export const /g, 'var ') + 
                      "\n; ({ ENGINE_DATA, CTA_MODEL_MASTER });";
        const { ENGINE_DATA, CTA_MODEL_MASTER } = eval(script);

        // 1. หา ID จาก Alias ใน CTA_MODEL_MASTER
        const id = Object.keys(CTA_MODEL_MASTER).find(key => 
            CTA_MODEL_MASTER[key].alias === targetAlias
        );

        if (!id) return null;

        // 2. ดึงค่าจากทั้งสองตารางมา Merge กัน
        const cta = CTA_MODEL_MASTER[id];
        const technical = ENGINE_DATA[id] || {};

        return {
            provider: technical.provider || cta.engine,
            modelId: technical.model || cta.model,
            endpoint: technical.endpoint || cta.endpoint,
            cost: cta.cost || 10,
            alias: targetAlias
        };
    } catch (e) {
        console.error("❌ DATA ERROR:", e.message);
        return null;
    }
};

exports.create = async (req, res) => {
    try {
        const { alias, prompt, is_test, master_key } = req.body;

        // 1. MASTER BYPASS (สำหรับเทสผ่าน Terminal)
        const user = (master_key === "SN_ULTRA_2026_SECRET") ? { id: "ADMIN-TERMINAL" } : req.user;
        if (!user) return res.status(401).json({ error: "UNAUTHORIZED" });

        // 2. ดึง Config (ดึงตรงจากไฟล์ Frontend ของพี่)
        const config = getEngineConfig(alias);
        if (!config) return res.status(404).json({ error: `CANNOT_FIND_CONFIG_FOR_${alias}` });

        const jobId = is_test ? `TEST-${uuidv4().slice(0,8)}` : `JOB-${uuidv4().slice(0,8)}`;

        // 3. SANDBOX MODE
        if (is_test === true || is_test === "true") {
            db.run("INSERT INTO jobs (id, user_id, engine, prompt, cost, status) VALUES (?,?,?,?,?,?)", 
            [jobId, user.id, config.provider, `[TEST] ${prompt}`, 0, 'test_success']);
            
            return res.json({ 
                status: "success", 
                mode: "sandbox", 
                jobId, 
                engine: config.provider,
                model: config.modelId 
            });
        }

        // 4. PRODUCTION MODE (หักสต็อกจริง)
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
