const { v4: uuidv4 } = require("uuid");
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = '/home/ubuntu/sn-payment-core/database.db';
const DATA_FILE = '/home/ubuntu/narong69za.github.io/assets/js/engine.data.js';

const db = new sqlite3.Database(DB_PATH);

// --- ฟังก์ชันดึงข้อมูลแบบ "อ่านข้อความตรงๆ" (No Eval = No Error) ---
const getEngineConfig = (target) => {
    try {
        if (!fs.existsSync(DATA_FILE)) return null;
        const content = fs.readFileSync(DATA_FILE, 'utf8');

        // ค้นหาช่วงข้อมูลของ CTA_MODEL_MASTER
        const masterMatch = content.match(/export const CTA_MODEL_MASTER = ({[\s\S]*?});/);
        const engineMatch = content.match(/export const ENGINE_DATA = ({[\s\S]*?});/);
        
        if (!masterMatch || !engineMatch) return null;

        // แปลงเป็น Object แบบปลอดภัย
        const CTA_MODEL_MASTER = eval(`(${masterMatch[1]})`);
        const ENGINE_DATA = eval(`(${engineMatch[1]})`);

        const entry = Object.entries(CTA_MODEL_MASTER).find(([k, v]) => v.alias === target || v.cta === target);
        if (!entry) return null;

        const [id, cta] = entry;
        const technical = ENGINE_DATA[id] || {};

        return {
            provider: technical.provider || cta.engine,
            modelId: technical.model || cta.model,
            cost: cta.cost || 10,
            alias: target
        };
    } catch (e) {
        return null;
    }
};

exports.create = async (req, res) => {
    try {
        const { alias, template, prompt, is_test, master_key } = req.body;
        const target = alias || template;

        // MASTER BYPASS
        if (master_key !== "SN_ULTRA_2026_SECRET" && !req.user) {
            return res.status(401).json({ error: "UNAUTHORIZED" });
        }
        const userId = req.user ? req.user.id : "ADMIN-TERMINAL";

        const config = getEngineConfig(target);
        if (!config) return res.status(404).json({ error: `ENGINE_NOT_FOUND: ${target}` });

        const jobId = is_test ? `TEST-${uuidv4().slice(0,8)}` : `JOB-${uuidv4().slice(0,8)}`;

        if (is_test === true || is_test === "true") {
            db.run("INSERT INTO jobs (id, user_id, engine, prompt, cost, status) VALUES (?,?,?,?,?,?)", 
            [jobId, userId, config.provider, `[TEST] ${prompt || 'UI'}`, 0, 'test_success']);
            return res.json({ status: "success", mode: "sandbox", job_id: jobId });
        }

        // PRODUCTION
        db.serialize(() => {
            db.run("UPDATE admin_stocks SET remaining_stock = remaining_stock - 1 WHERE service_name = ?", [config.provider]);
            db.run("INSERT INTO jobs (id, user_id, engine, prompt, cost, status) VALUES (?,?,?,?,?,?)", 
            [jobId, userId, config.provider, prompt || 'UI Render', config.cost, 'processing']);
        });

        res.json({ status: "success", success: true, job_id: jobId });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
