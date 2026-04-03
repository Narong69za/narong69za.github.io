const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = '/home/ubuntu/sn-payment-core/database.db';
const FRONTEND_PATH = "/home/ubuntu/narong69za.github.io";
const DATA_FILE = path.join(FRONTEND_PATH, "assets/js/cta.model.master.js");

const db = new sqlite3.Database(DB_PATH);

exports.create = async (req, res) => {
    try {
        const { alias, template, prompt, is_test } = req.body;
        const target = alias || template;

        if (!fs.existsSync(DATA_FILE)) {
            return res.status(500).json({ error: "MASTER_FILE_NOT_FOUND_ON_SERVER" });
        }

        // 1. อ่านไฟล์และสกัด CTA_MODEL_MASTER
        const content = fs.readFileSync(DATA_FILE, 'utf8');
        const script = content.replace(/export\s+const\s+/g, 'var ') + "\n return CTA_MODEL_MASTER;";
        const CTA_MODEL_MASTER = new Function(script)();

        // 2. ค้นหา Config
        const config = Object.values(CTA_MODEL_MASTER).find(v => v.alias === target || v.cta === target);
        
        if (!config) {
            return res.status(404).json({ error: `ENGINE_NOT_FOUND_FOR: ${target}` });
        }

        const jobId = is_test ? `TEST-${uuidv4().slice(0,8)}` : `JOB-${uuidv4().slice(0,8)}`;
        const userId = req.user ? req.user.id : "ADMIN-TERMINAL";

        // 3. บันทึกลง Database
        db.run("INSERT INTO jobs (id, user_id, engine, alias, prompt, cost, status) VALUES (?,?,?,?,?,?,?)",
            [jobId, userId, config.engine, config.alias, prompt || "UI", is_test ? 0 : (config.cost || 10), is_test ? 'test_success' : 'processing'],
            (err) => { 
                if (err) {
                    console.error("❌ DB_INSERT_ERR:", err.message);
                    return;
                }

                // >>>>>>> [ชุดเทอร์โบ: รันหลังจากบันทึก DB สำเร็จ] <<<<<<<
                if (!is_test) {
                    (async () => {
                        try {
                            const API_KEY = process.env.RUNWAY_API_KEY; 
                            const aiResponse = await axios.post("https://api.runwayml.com/v1/generate", {
                                model: config.model,
                                promptText: prompt,
                                asset_id: jobId
                            }, {
                                headers: { "Authorization": `Bearer ${API_KEY}` }
                            });

                            if (aiResponse.data) {
                                db.run("UPDATE jobs SET status = 'running' WHERE id = ?", [jobId]);
                            }
                        } catch (apiErr) {
                            console.error(`❌ AI_PROVIDER_ERR (${config.engine}):`, apiErr.message);
                            db.run("UPDATE jobs SET status = 'failed' WHERE id = ?", [jobId]);
                        }
                    })(); 
                }
            }
        );

        // 4. ตอบกลับ Client ทันที (ไม่ต้องรอเรนเดอร์เสร็จ)
        res.json({ 
            status: "success", 
            success: true, 
            job_id: jobId, 
            engine: config.engine,
            model: config.model 
        });

    } catch (err) { 
        console.error("❌ CONTROLLER_ERR:", err.message);
        res.status(500).json({ error: "INTERNAL_SERVER_ERROR", message: err.message }); 
    }
};
                
