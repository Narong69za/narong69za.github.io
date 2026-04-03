const { v4: uuidv4 } = require("uuid");
const db = require("../db/db");
const modelRouter = require("../models/model.router");
const creditEngine = require("../services/credit.engine");
const { getEngine } = require("../services/engine.map");

exports.create = async (req, res) => {
   try {
      const { alias, prompt, is_test, master_key } = req.body;
      
      // 1. ระบุตัวตน (ถ้ามาด้วย Master Key ให้เป็น Admin)
      let user = req.user || (master_key === "SN_ULTRA_2026_SECRET" ? { id: "ADMIN-TESTER" } : null);
      if (!user) return res.status(401).json({ error: "UNAUTHORIZED" });

      const lockedEngineConfig = getEngine(alias);
      const jobId = is_test ? `TEST-${uuidv4().slice(0,8)}` : `JOB-${uuidv4().slice(0,8)}`;

      // =====================================================
      // 🧪 [SANDBOX MODE] - เทสระบบฟรี ไม่หักเครดิต ไม่ยิง AI จริง
      // =====================================================
      if (is_test === true) {
         db.run(
            "INSERT INTO jobs (id, user_id, engine, prompt, cost, status) VALUES (?, ?, ?, ?, ?, ?)", 
            [jobId, user.id, lockedEngineConfig.provider, "[SANDBOX] " + prompt, 0, 'test_success']
         );

         return res.json({
            status: "success",
            mode: "sandbox",
            message: "Online & Connection Verified",
            jobId: jobId,
            engine: lockedEngineConfig.provider
         });
      }

      // =====================================================
      // 💰 [PRODUCTION MODE] - รันจริง หักเงินจริง
      // =====================================================
      
      // -- เช็คและหักเครดิต User --
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const freeAllowed = await creditEngine.checkFreeUsage(ip);
      if (!freeAllowed) {
         const creditCheck = await creditEngine.checkAndUseCredit(user.id, alias, lockedEngineConfig.cost);
         if (!creditCheck.allowed) return res.status(402).json({ error: "Not enough credits" });
      }

      // -- ยิงคำสั่งไปหา AI Provider จริง --
      const result = await modelRouter.run({
         userId: user.id,
         engine: lockedEngineConfig.provider,
         alias,
         prompt,
         files: req.files
      });

      // -- หักสต็อกพี่ และ บันทึกงานลง DB --
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
