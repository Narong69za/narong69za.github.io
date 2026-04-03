// =====================================================
// PROJECT: SN DESIGN ENGINE AI
// MODULE: controllers/create.controller.js
// VERSION: v9.5 (ULTRA MIDDLEWARE INTEGRATION)
// STATUS: production
// =====================================================

const { v4: uuidv4 } = require("uuid");
const db = require("../db/db"); // เชื่อมต่อ SQLite database.db
const modelRouter = require("../models/model.router");
const creditEngine = require("../services/credit.engine");
const { getEngine } = require("../services/engine.map");

exports.create = async (req, res) => {
   // ใช้ Database Transaction เพื่อความแม่นยำของเครดิต
   const trx = await new Promise((resolve) => db.run("BEGIN TRANSACTION", (err) => resolve(err)));

   try {
      const { engine, alias, type, prompt } = req.body;
      const user = req.user || { id: "DEV-BYPASS" };
      const files = {};

      if (req.files && Array.isArray(req.files)) {
         req.files.forEach(f => { files[f.fieldname] = f; });
      }

      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

      // 1. 🔒 ENGINE LOCK VALIDATION
      let lockedEngineConfig = null;
      try {
         lockedEngineConfig = getEngine(alias);
      } catch (e) {
         return res.status(400).json({ error: "ENGINE_NOT_ALLOWED" });
      }

      // 2. 💳 USER CREDIT CHECK & DEDUCTION
      const freeAllowed = await creditEngine.checkFreeUsage(ip);
      if (!freeAllowed) {
         const creditCheck = await creditEngine.checkAndUseCredit(
            user.id,
            alias,
            lockedEngineConfig.cost 
         );

         if (!creditCheck.allowed) {
            db.run("ROLLBACK");
            return res.status(402).json({ error: "Not enough credits" });
         }
      }

      // 3. 📁 FILE VALIDATION
      if (alias !== "text_to_video" && !files.fileA) {
         db.run("ROLLBACK");
         return res.status(400).json({ error: "fileA missing" });
      }

      // 4. 🤖 RUN AI MODEL (เรียกไปยัง API ภายนอก)
      const result = await modelRouter.run({
         userId: user.id,
         engine: lockedEngineConfig.provider, 
         alias,                                
         modelId: lockedEngineConfig.modelId,   
         type,
         prompt,
         files
      });

      // 5. 📉 ADMIN STOCK DEDUCTION (จุดที่พี่เป็นสื่อกลาง)
      // หักสต็อกส่วนกลางของพี่ในตาราง admin_stocks
      await new Promise((resolve, reject) => {
         db.run(
            "UPDATE admin_stocks SET remaining_stock = remaining_stock - 1, last_update = CURRENT_TIMESTAMP WHERE service_name = ?",
            [lockedEngineConfig.provider],
            (err) => (err ? reject(err) : resolve())
         );
      });

      // 6. 📝 LOG JOB TO DATABASE
      const jobId = result.id || `JOB-${uuidv4().slice(0,8)}`;
      await new Promise((resolve, reject) => {
         db.run(
            "INSERT INTO jobs (id, user_id, engine, prompt, cost, status, created_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
            [jobId, user.id, lockedEngineConfig.provider, prompt, lockedEngineConfig.cost, 'success'],
            (err) => (err ? reject(err) : resolve())
         );
      });

      // ยืนยันการหักเงินและบันทึกข้อมูลทั้งหมด
      db.run("COMMIT");

      res.json({
         status: "queued",
         jobId: jobId,
         engineVersion: lockedEngineConfig.version,
         result
      });

   } catch (err) {
      db.run("ROLLBACK"); // ยกเลิกการหักเงินถ้าพัง
      console.error("CREATE ERROR:", err);
      res.status(500).json({ error: err.message });
   }
};
   
