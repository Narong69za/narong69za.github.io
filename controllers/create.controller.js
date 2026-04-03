const { v4: uuidv4 } = require("uuid");
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = '/home/ubuntu/sn-payment-core/database.db';
const DATA_FILE = '/home/ubuntu/narong69za.github.io/assets/js/cta.model.master.js';
const db = new sqlite3.Database(DB_PATH);

exports.create = async (req, res) => {
    try {
        const { alias, template, prompt, is_test } = req.body;
        const target = alias || template;

        if (!fs.existsSync(DATA_FILE)) return res.status(500).json({ error: "MASTER_DATA_FILE_NOT_FOUND" });

        // อ่านไฟล์ Master Data สดๆ
        const content = fs.readFileSync(DATA_FILE, 'utf8');
        const cleanJS = content.replace(/export const/g, 'var');
        const MASTER = new Function(`${cleanJS}; return CTA_MODEL_MASTER;`)();

        const config = Object.values(MASTER).find(v => v.alias === target || v.cta === target);
        if (!config) return res.status(404).json({ error: `ENGINE_NOT_FOUND: ${target}` });

        const jobId = is_test ? `TEST-${uuidv4().slice(0,8)}` : `JOB-${uuidv4().slice(0,8)}`;
        const userId = (req.user && req.user.id) ? req.user.id : "ADMIN-BYPASS";

        // ลงบันทึกฐานข้อมูล
        db.run("INSERT INTO jobs (id, user_id, engine, prompt, cost, status) VALUES (?,?,?,?,?,?)", 
            [jobId, userId, config.engine, prompt || "RENDER", is_test ? 0 : 10, is_test ? 'test_success' : 'processing']
        );

        res.json({ status: "success", success: true, job_id: jobId, engine: config.engine, model: config.model });
    } catch (err) {
        console.error("🔥 CONTROLLER ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
};
