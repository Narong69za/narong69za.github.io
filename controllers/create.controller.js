// =====================================================
// PROJECT: SN DESIGN ENGINE AI
// MODULE: controllers/create.controller.js
// VERSION: v9.9.1 (FIX: DB CONNECTION)
// =====================================================

const { v4: uuidv4 } = require("uuid");
const sqlite3 = require('sqlite3').verbose();
const modelRouter = require("../models/model.router");
const creditEngine = require("../services/credit.engine");
const { getEngine } = require("../services/engine.map");

// [FIX] เชื่อมต่อ Database ให้เป็นตัวเดียวกับ index.js
const db = new sqlite3.Database('/home/ubuntu/sn-payment-core/database.db');

exports.create = async (req, res) => {
   try {
      const { alias, prompt, is_test, master_key } = req.body;
      
      // 1. ระบุตัวตน (Master Key Bypass)
      let user = req.user || (master_key === "SN_ULTRA_2026_SECRET" ? { id: "ADMIN-TESTER" } : null);
      if (!user) return res.status(401).json({ error: "UNAUTHORIZED" });

      const lockedEngineConfig = getEngine(alias);
      const jobId = is_test ? `TEST-${uuidv4().slice(0,8)}` : `JOB-${uuidv4().slice(0,8)}`;

      // =====================================================
      // 🧪 [SANDBOX MODE] - เทสระบบฟรี
      // =====================================================
      if (is_test === true || is_test === "true") {
         db.run(
            "INSERT INTO jobs (id, user_id, engine, prompt, cost, status) VALUES (?, ?, ?, ?, ?, ?)", 
            [jobId, user.id, lockedEngineConfig.provider, "[SANDBOX] " + prompt, 0, 'test_success']
         );

         return res.json({
            status: "success",
            mode: "sandbox",
            jobId: jobId,
            engine: lockedEngineConfig.provider
         });
      }

      // =====================================================
      // 💰 [PRODUCTION MODE] - รันจริง หักเงินจริง
      // =====================================================
      
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const freeAllowed = await creditEngine.checkFreeUsage(ip);
      if (!freeAllowed) {
         const creditCheck = await creditEngine.checkAndUseCredit(user.id, alias, lockedEngineConfig.cost);
         if (!creditCheck.allowed) return res.status(402).json({ error: "Not enough credits" });
      }

      const result = await modelRouter.run({
         userId: user.id,
         engine: lockedEngineConfig.provider,
         alias,
         prompt,
         files: req.files
      });

      // หักสต็อกพี่ และ บันทึกงาน
      db.serialize(() => {
         db.run("UPDATE admin_stocks SET remaining_stock = remaining_stock - 1 WHERE service_name = ?", [lockedEngineConfig.provider]);
         db.run("INSERT INTO jobs (id, user_id, engine, prompt, cost, status) VALUES (?, ?, ?, ?, ?, ?)", 
         [jobId, user.id, lockedEngineConfig.provider, prompt, lockedEngineConfig.cost, 'success']);
      });

      res.json({ status: "success", jobId: result.id, result });

   } catch (err) {
      console.error("CREATE ERROR:", err);
      res.status(500).json({ error: err.message });
   }
};
            
