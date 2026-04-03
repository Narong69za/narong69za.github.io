// =====================================================
// [FRONTEND LOGIC] controllers/create.controller.js
// VERSION: v10.0.2 (FINAL BOSS FIX: NESTED OBJECT SYNC)
// =====================================================
const { v4: uuidv4 } = require("uuid");
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = '/home/ubuntu/sn-payment-core/database.db';
const DATA_FILE = '/home/ubuntu/narong69za.github.io/assets/js/engine.data.js';

const db = new sqlite3.Database(DB_PATH);

// ฟังก์ชันดึงข้อมูลแบบ "กวาดเรียบ" จากไฟล์ JS
const getMasterConfig = (alias) => {
    try {
        const content = fs.readFileSync(DATA_FILE, 'utf8');
        
        // ใช้การ Split ข้อความแทน Regex เพื่อความชัวร์กับ Nested Objects
        const extract = (varName) => {
            const splitKey = `export const ${varName} =`;
            if (!content.includes(splitKey)) return null;
            
            // ตัดเอาตั้งแต่หลังเครื่องหมาย = จนถึง export ตัวถัดไป หรือคอมเมนต์
            let segment = content.split(splitKey)[1];
            segment = segment.split('export const')[0].split('/*')[0].trim();
            
            // ลบเครื่องหมาย ; ตัวสุดท้าย (ถ้ามี)
            if (segment.endsWith(';')) segment = segment.slice(0, -1);
            
            return eval(`(${segment})`);
        };

        const ctaMaster = extract('CTA_MODEL_MASTER');
        const engineData = extract('ENGINE_DATA');

        if (!ctaMaster || !engineData) return null;

        // ค้นหา ID (Key) จาก Alias ใน CTA_MODEL_MASTER
        const entry = Object.entries(ctaMaster).find(([k, v]) => v.alias === alias);
        if (!entry) return null;

        const [key, ctaInfo] = entry;
        const technical = engineData[key]; // ดึงข้อมูลเทคนิคจาก ENGINE_DATA ด้วย Key เดียวกัน

        if (!technical) return null;

        return {
            provider: technical.provider,
            modelId: technical.model,
            endpoint: technical.endpoint,
            cost: ctaInfo.cost || 10,
            alias: alias
        };
    } catch (e) {
        console.error("❌ DATA SYNC ERROR:", e.message);
        return null;
    }
};

exports.create = async (req, res) => {
    try {
        const { alias, prompt, is_test, master_key } = req.body;

        // 1. Auth & Bypass
        const user = (master_key === "SN_ULTRA_2026_SECRET") ? { id: "ADMIN-TERMINAL" } : req.user;
        if (!user) return res.status(401).json({ error: "UNAUTHORIZED" });

        // 2. ดึง Config (ดึงใหม่ทุกครั้งเพื่อให้ Sync กับ Frontend ตลอด)
        const config = getMasterConfig(alias);
        if (!config) return res.status(404).json({ error: `ALIAS_${alias}_NOT_FOUND_IN_ENGINE_DATA` });

        const jobId = is_test ? `TEST-${uuidv4().slice(0,8)}` : `JOB-${uuidv4().slice(0,8)}`;

        // 3. Sandbox Mode (เทสระบบ)
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
