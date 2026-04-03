const { v4: uuidv4 } = require("uuid");
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = '/home/ubuntu/sn-payment-core/database.db';
const FRONTEND_PATH = "/home/ubuntu/narong69za.github.io";
const DATA_FILE = path.join(FRONTEND_PATH, "Assets/js/engine.data.js");

const db = new sqlite3.Database(DB_PATH);

const getEngineConfig = (target) => {
    try {
        if (!fs.existsSync(DATA_FILE)) return null;
        let content = fs.readFileSync(DATA_FILE, 'utf8');

        // ล้างคำว่า export และเปลี่ยน const เป็น var ในอากาศ เพื่อให้โหลดซ้ำได้ไม่พัง
        const cleanJS = content.replace(/export\s+/g, '').replace(/const\s+/g, 'var ');
        
        // สร้างกระดาษทด (Function Scope) เพื่อดึงข้อมูลออกมา
        const shadowRunner = new Function(`
            ${cleanJS}; 
            return { ENGINE_DATA, CTA_MODEL_MASTER };
        `);
        
        const { ENGINE_DATA, CTA_MODEL_MASTER } = shadowRunner();

        // ค้นหา Key (1, 2, 3...) จาก alias หรือ cta
        const entry = Object.entries(CTA_MODEL_MASTER).find(([k, v]) => 
            v.alias === target || v.cta === target
        );

        if (!entry) return null;
        const [id, ctaInfo] = entry;
        const technical = ENGINE_DATA[id] || {};

        return {
            provider: technical.provider || ctaInfo.engine,
            modelId: technical.model || ctaInfo.model,
            endpoint: technical.endpoint || ctaInfo.endpoint,
            cost: ctaInfo.cost || 10,
            alias: ctaInfo.alias
        };
    } catch (e) {
        console.error("❌ SYNC ERROR:", e.message);
        return null;
    }
};

exports.create = async (req, res) => {
    try {
        const { alias, template, prompt, is_test, master_key } = req.body;
        const target = alias || template;

        // 1. MASTER BYPASS
        const user = (master_key === "SN_ULTRA_2026_SECRET") ? { id: "ADMIN-TERMINAL" } : req.user;
        if (!user) return res.status(401).json({ error: "UNAUTHORIZED" });

        // 2. ดึง Config (ดึงตรงจากไฟล์ ไม่ผ่าน engine.map.js แล้ว)
        const config = getEngineConfig(target);
        if (!config) return res.status(404).json({ error: `NOT_FOUND_${target}` });

        const jobId = is_test ? `TEST-${uuidv4().slice(0,8)}` : `JOB-${uuidv4().slice(0,8)}`;

        // 3. SANDBOX MODE
        if (is_test === true || is_test === "true") {
            db.run("INSERT INTO jobs (id, user_id, engine, prompt, cost, status) VALUES (?,?,?,?,?,?)", 
            [jobId, user.id, config.provider, `[TEST] ${prompt || 'UI'}`, 0, 'test_success']);
            return res.json({ status: "success", mode: "sandbox", job_id: jobId, engine: config.provider });
        }

        // 4. PRODUCTION MODE
        db.serialize(() => {
            db.run("UPDATE admin_stocks SET remaining_stock = remaining_stock - 1 WHERE service_name = ?", [config.provider]);
            db.run("INSERT INTO jobs (id, user_id, engine, prompt, cost, status) VALUES (?,?,?,?,?,?)", 
            [jobId, user.id, config.provider, prompt || 'UI Render', config.cost, 'processing']);
        });

        res.json({ status: "success", success: true, job_id: jobId, engine: config.provider });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
