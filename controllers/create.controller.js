const { v4: uuidv4 } = require("uuid");
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = '/home/ubuntu/sn-payment-core/database.db';
const FRONTEND_PATH = "/home/ubuntu/narong69za.github.io";
const DATA_FILE = path.join(FRONTEND_PATH, "assets/js/engine.data.js");

const db = new sqlite3.Database(DB_PATH);

// --- ฟังก์ชันดึงข้อมูลแบบ "เสถียรสูงสุด" ---
const getSyncConfig = (target) => {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            console.error("❌ FILE NOT FOUND:", DATA_FILE);
            return null;
        }

        const content = fs.readFileSync(DATA_FILE, 'utf8');
        
        // แปลง export const เป็น var และหุ้มด้วย Function เพื่อดึง Object ออกมาตรงๆ
        // วิธีนี้จะไม่พังเพราะ Regex และไม่เกิด Error "Already Declared"
        const cleanJS = content.replace(/export\s+const/g, 'var');
        const runner = new Function(`${cleanJS}; return { CTA_MODEL_MASTER, ENGINE_DATA };`);
        const { CTA_MODEL_MASTER, ENGINE_DATA } = runner();

        // ค้นหา ID จาก alias หรือ cta
        const entry = Object.entries(CTA_MODEL_MASTER).find(([k, v]) => 
            v.alias === target || v.cta === target
        );

        if (!entry) return null;
        
        const [id, ctaInfo] = entry;
        const technical = ENGINE_DATA[id] || {};

        return {
            provider: technical.provider || ctaInfo.engine,
            modelId: technical.model || ctaInfo.model,
            cost: ctaInfo.cost || 10,
            alias: ctaInfo.alias
        };
    } catch (e) {
        console.error("❌ DATA PARSE ERROR:", e.message);
        return null;
    }
};

exports.create = async (req, res) => {
    try {
        const { alias, template, prompt, is_test, master_key } = req.body;
        const target = alias || template;

        // 1. ตรวจ Master Key
        if (master_key !== "SN_ULTRA_2026_SECRET" && !req.user) {
            return res.status(401).json({ error: "UNAUTHORIZED" });
        }

        // 2. ดึง Config ล่าสุด
        const config = getSyncConfig(target);
        if (!config) {
            return res.status(404).json({ error: `CONFIG_NOT_FOUND_FOR: ${target}` });
        }

        const jobId = is_test ? `TEST-${uuidv4().slice(0,8)}` : `JOB-${uuidv4().slice(0,8)}`;

        // 3. บันทึก DB
        const userId = req.user ? req.user.id : "ADMIN-TERMINAL";
        const status = is_test ? 'test_success' : 'processing';
        const finalCost = is_test ? 0 : config.cost;

        db.run("INSERT INTO jobs (id, user_id, engine, prompt, cost, status) VALUES (?,?,?,?,?,?)", 
            [jobId, userId, config.provider, prompt || "UI Render", finalCost, status], 
            (err) => {
                if (err) console.error("❌ DB INSERT ERROR:", err.message);
            }
        );

        res.json({ status: "success", success: true, job_id: jobId, engine: config.provider });

    } catch (err) {
        console.error("🔥 CONTROLLER CRASH:", err.message);
        res.status(500).json({ error: err.message });
    }
};
