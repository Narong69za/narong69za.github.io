const { v4: uuidv4 } = require("uuid");
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = '/home/ubuntu/sn-payment-core/database.db';
const DATA_FILE = '/home/ubuntu/narong69za.github.io/Assets/js/engine.data.js';
const db = new sqlite3.Database(DB_PATH);

exports.create = async (req, res) => {
    try {
        const { alias, template, prompt, is_test, master_key } = req.body;
        const target = alias || template;

        // 1. ดึงข้อมูลจาก Assets/js/engine.data.js (วิธีอ่านแบบ String กัน Error Redeclare)
        const content = fs.readFileSync(DATA_FILE, 'utf8');
        const masterMatch = content.match(/export const CTA_MODEL_MASTER = ({[\s\S]*?});/);
        const engineMatch = content.match(/export const ENGINE_DATA = ({[\s\S]*?});/);
        
        const CTA_MASTER = eval(`(${masterMatch[1]})`);
        const ENGINE_DATA = eval(`(${engineMatch[1]})`);

        const entry = Object.entries(CTA_MASTER).find(([k, v]) => v.alias === target || v.cta === target);
        if (!entry) return res.status(404).json({ error: `ENGINE_NOT_FOUND: ${target}` });

        const config = { ...ENGINE_DATA[entry[0]], cost: entry[1].cost || 10 };
        const jobId = is_test ? `TEST-${uuidv4().slice(0,8)}` : `JOB-${uuidv4().slice(0,8)}`;

        // 2. บันทึกลง DB
        db.run("INSERT INTO jobs (id, user_id, engine, prompt, cost, status) VALUES (?,?,?,?,?,?)", 
        [jobId, "SYSTEM", config.provider, prompt || "RENDER", is_test ? 0 : config.cost, is_test ? 'test_success' : 'processing']);

        res.json({ status: "success", job_id: jobId, engine: config.provider });
    } catch (err) { res.status(500).json({ error: err.message }); }
};
