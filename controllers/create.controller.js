// =====================================================
// [FRONTEND LOGIC] controllers/create.controller.js
// VERSION: v10.0.1 (BULLETPROOF DATA MAPPING)
// =====================================================
const { v4: uuidv4 } = require("uuid");
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = '/home/ubuntu/sn-payment-core/database.db';
const DATA_FILE = '/home/ubuntu/narong69za.github.io/assets/js/engine.data.js';

const db = new sqlite3.Database(DB_PATH);

const getMasterConfig = (alias) => {
    try {
        const content = fs.readFileSync(DATA_FILE, 'utf8');
        
        // ใช้ Regex แบบยืดหยุ่นสูง เพื่อดึง Object ออกมา
        const extractObject = (name) => {
            const regex = new RegExp(`export const ${name} = ({[\\s\\S]*?})(?=\\s*export|\\s*$)`);
            const match = content.match(regex);
            return match ? eval(`(${match[1]})`) : null;
        };

        const ctaMaster = extractObject('CTA_MODEL_MASTER');
        const engineData = extractObject('ENGINE_DATA');

        if (!ctaMaster || !engineData) return null;

        // ค้นหา Key จาก Alias
        const entry = Object.entries(ctaMaster).find(([k, v]) => v.alias === alias);
        if (!entry) return null;

        const [key, ctaInfo] = entry;
        const technical = engineData[key];

        if (!technical) return null;

        return {
            provider: technical.provider,
            modelId: technical.model,
            endpoint: technical.endpoint,
            cost: ctaInfo.cost || 10,
            alias: alias
        };
    } catch (e) {
        console.error("❌ MAPPING ERROR:", e.message);
        return null;
    }
};

exports.create = async (req, res) => {
    try {
        const { alias, prompt, is_test, master_key } = req.body;

        // 1. ตรวจสอบ Master Key หรือ Session
        const user = (master_key === "SN_ULTRA_2026_SECRET") ? { id: "ADMIN-TEST" } : req.user;
        if (!user) return res.status(401).json({ error: "UNAUTHORIZED" });

        // 2. ดึง Config จาก engine.data.js
        const config = getMasterConfig(alias);
        if (!config) return res.status(404).json({ error: "ENGINE_NOT_FOUND_IN_DATA" });

        const jobId = is_test ? `TEST-${uuidv4().slice(0,8)}` : `JOB-${uuidv4().slice(0,8)}`;

        // 3. Sandbox Mode
        if (is_test === true || is_test === "true") {
            db.run("INSERT INTO jobs (id, user_id, engine, prompt, cost, status) VALUES (?,?,?,?,?,?)", 
            [jobId, user.id, config.provider, `[TEST] ${prompt}`, 0, 'test_success']);
            
            return res.json({ status: "success", mode: "sandbox", jobId, engine: config.provider });
        }

        // 4. Production Mode (หักสต็อกจริง)
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
