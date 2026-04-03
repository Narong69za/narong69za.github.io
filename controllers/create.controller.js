const { v4: uuidv4 } = require("uuid");
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = '/home/ubuntu/sn-payment-core/database.db';
const DATA_FILE = '/home/ubuntu/narong69za.github.io/assets/js/cta.model.master.js';
const db = new sqlite3.Database(DB_PATH);

exports.create = async (req, res) => {
    try {
        const { alias, template, prompt, is_test, master_key } = req.body;
        const target = alias || template;

        if (!fs.existsSync(DATA_FILE)) return res.status(500).json({ error: "MASTER_DATA_MISSING" });

        // อ่านไฟล์สดๆ เพื่อป้องกันการประกาศตัวแปรซ้ำ (Eval Scope)
        const content = fs.readFileSync(DATA_FILE, 'utf8');
        const cleanJS = content.replace(/export const/g, 'var');
        const runner = new Function(`${cleanJS}; return CTA_MODEL_MASTER;`);
        const MASTER = runner();

        const config = Object.values(MASTER).find(v => v.alias === target || v.cta === target);
        if (!config) return res.status(404).json({ error: `ENGINE_NOT_FOUND: ${target}` });

        const jobId = is_test ? `TEST-${uuidv4().slice(0,8)}` : `JOB-${uuidv4().slice(0,8)}`;
        
        // --- ส่วนการเรียก API จริง (ตัวอย่าง Runway) ---
        // ตรวจสอบ API KEY จาก process.env ที่โหลดจาก index.js
        const apiKey = process.env.RUNWAY_API_KEY; 

        db.run("INSERT INTO jobs (id, user_id, engine, prompt, cost, status) VALUES (?,?,?,?,?,?)", 
            [jobId, "SYSTEM", config.engine, prompt || "UI", is_test ? 0 : 10, is_test ? 'test_success' : 'processing']
        );

        res.json({ status: "success", success: true, job_id: jobId, engine: config.engine });
    } catch (err) {
        console.error("🔥 CRITICAL ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
};
