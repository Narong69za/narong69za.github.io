const { v4: uuidv4 } = require("uuid");
const db = require("../db/db");
const modelRouter = require("../models/model.router");
const creditEngine = require("../services/credit.engine");
const { getEngine } = require("../services/engine.map");

exports.create = async (req, res) => {
   try {
      const { alias, prompt, is_test, master_key } = req.body;
      
      // 1. [BYPASS AUTH] สำหรับเทสผ่าน Terminal
      let user = req.user;
      if (master_key === "SN_ULTRA_2026_SECRET") {
          user = { id: "ADMIN-TESTER" };
      } else if (!user) {
          return res.status(401).json({ error: "UNAUTHORIZED" });
      }

      const lockedEngineConfig = getEngine(alias);
      const jobId = `TEST-${uuidv4().slice(0,8)}`;

      // =====================================================
      // 🚀 [SANDBOX MODE] - เทสฟรี ไม่หักเงิน ไม่ยิง AI จริง
      // =====================================================
      if (is_test === true) {
         // บันทึกงานลง DB เป็นสถานะ "TEST_SUCCESS" เพื่อให้โชว์ใน Dashboard
         db.serialize(() => {
            db.run("INSERT INTO jobs (id, user_id, engine, prompt, cost, status) VALUES (?, ?, ?, ?, ?, ?)", 
            [jobId, user.id, lockedEngineConfig.provider, "[TEST] " + prompt, 0, 'test_success']);
         });

         return res.json({
            status: "success",
            mode: "sandbox",
            message: "ระบบเชื่อมต่อปกติ (ไม่ได้หักเครดิตจริง)",
            jobId: jobId,
            engine: lockedEngineConfig.provider
         });
      }

      // =====================================================
      // 💰 [PRODUCTION MODE] - หักเงินจริง ยิงจริง (ใช้ตอนเปิดระบบจริง)
      // =====================================================
      
      // (ส่วนนี้คือ Logic เดิมที่ผมให้ไปก่อนหน้า... หักเครดิต User และยิง modelRouter.run)
      // [ใส่โค้ดเดิมของพี่ตรงนี้...]

   } catch (err) {
      console.error("CREATE ERROR:", err);
      res.status(500).json({ error: err.message });
   }
};
