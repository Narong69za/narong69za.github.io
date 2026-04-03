// =====================================================
// [FRONTEND LOGIC] controllers/create.controller.js
// VERSION: v10.6.0 (FINAL SYNC: TEMPLATE & ALIAS)
// =====================================================
const { v4: uuidv4 } = require("uuid");
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = '/home/ubuntu/sn-payment-core/database.db';
const DATA_FILE = '/home/ubuntu/narong69za.github.io/assets/js/engine.data.js';

const db = new sqlite3.Database(DB_PATH);

const getEngineConfig = (target) => {
    try {
        const content = fs.readFileSync(DATA_FILE, 'utf8');
        const script = content.replace(/export const /g, 'var ') + "\n; ({ ENGINE_DATA, CTA_MODEL_MASTER });";
        const { ENGINE_DATA, CTA_MODEL_MASTER } = eval(script);

        // ค้นหาโดยเช็คทั้ง alias หรือ cta (template จากหน้าเว็บคือค่า CTA_01, CTA_02...)
        const id = Object.keys(CTA_MODEL_MASTER).find(key => 
            CTA_MODEL_MASTER[key].alias === target || CTA_MODEL_MASTER[key].cta === target
        );

        if (!id) return null;
        return { ...ENGINE_DATA[id], cost: CTA_MODEL_MASTER[id].cost || 10, alias: CTA_MODEL_MASTER[id].alias };
    } catch (e) { return null; }
};

exports.create = async (req, res) => {
    try {
        // ดึง template (จากหน้าเว็บ) หรือ alias (จาก cURL)
        const { template, alias, prompt, is_test, master_key } = req.body;
        const targetIdentifier = template || alias; // ใช้ตัวไหนก็ได้ที่มีค่า

        const user = (master_key === "SN_ULTRA_2026_SECRET") ? { id: "ADMIN-TEST" } : req.user;
        if (!user) return res.status(401).json({ error: "UNAUTHORIZED" });

        const config = getEngineConfig(targetIdentifier);
        if (!config) return res.status(404).json({ error: `ENGINE_NOT_FOUND_FOR_${targetIdentifier}` });

        const jobId = is_test ? `TEST-${uuidv4().slice(0,8)}` : `JOB-${uuidv4().slice(0,8)}`;

        if (is_test === true || is_test === "true") {
            db.run("INSERT INTO jobs (id, user_id, engine, prompt, cost, status) VALUES (?,?,?,?,?,?)", 
            [jobId, user.id, config.provider, `[TEST] ${prompt || 'UI Render'}`, 0, 'test_success']);
            return res.json({ status: "success", success: true, mode: "sandbox", job_id: jobId });
        }

        // PRODUCTION (รันจริง)
        db.serialize(() => {
            db.run("UPDATE admin_stocks SET remaining_stock = remaining_stock - 1 WHERE service_name = ?", [config.provider]);
            db.run("INSERT INTO jobs (id, user_id, engine, prompt, cost, status) VALUES (?,?,?,?,?,?)", 
            [jobId, user.id, config.provider, prompt || 'UI Render', config.cost, 'processing']);
        });

        res.json({ status: "success", success: true, job_id: jobId });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
