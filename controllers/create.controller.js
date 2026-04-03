const { v4: uuidv4 } = require("uuid");
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = '/home/ubuntu/sn-payment-core/database.db';
const DATA_FILE = '/home/ubuntu/narong69za.github.io/assets/js/engine.data.js';
const db = new sqlite3.Database(DB_PATH);

exports.create = async (req, res) => {
    try {
        const { alias, template, prompt, is_test, master_key } = req.body;
        const target = alias || template;

        if (!fs.existsSync(DATA_FILE)) return res.status(500).json({ error: "DATA_FILE_MISSING" });

        // 1. อ่านไฟล์และแปลง 'export const' เป็น 'var' เพื่อให้ Function Scope มองเห็น
        const content = fs.readFileSync(DATA_FILE, 'utf8');
        
        // กฎเหล็ก: เปลี่ยน export const เป็น var และสั่ง Return ค่าออกมาตรงๆ
        const script = content.replace(/export\s+const\s+/g, 'var ') + 
                      "\n return { CTA_MODEL_MASTER, ENGINE_DATA };";
        
        // รันสคริปต์ในห้องปิดตาย (Isolated Scope)
        const data = new Function(script)();

        // 2. ค้นหาข้อมูลจาก Alias หรือ Template (CTA_01, etc.)
        const entry = Object.entries(data.CTA_MODEL_MASTER).find(([k, v]) => 
            v.alias === target || v.cta === target
        );
        
        if (!entry) return res.status(404).json({ error: `ENGINE_NOT_FOUND: ${target}` });

        const config = { ...data.ENGINE_DATA[entry[0]], cost: entry[1].cost || 10 };
        const jobId = is_test ? `TEST-${uuidv4().slice(0,8)}` : `JOB-${uuidv4().slice(0,8)}`;

        // 3. บันทึกลง Database
        db.run("INSERT INTO jobs (id, user_id, engine, prompt, cost, status) VALUES (?,?,?,?,?,?)", 
            [jobId, "SYSTEM", config.provider, prompt || "UI", is_test ? 0 : config.cost, is_test ? 'test_success' : 'processing']
        );

        res.json({ status: "success", success: true, job_id: jobId, engine: config.provider });
    } catch (err) { 
        console.error("❌ ERROR:", err.message);
        res.status(500).json({ error: err.message }); 
    }
};Assetsssets
