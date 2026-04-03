// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: services/usage-check.js (ULTRA CONNECTED)
// RESPONSIBILITY: 
// - Dual-Mode Support: FREE (5/day) & PAID (Option B)
// - ID-Based Tracking (Email or IP)
// =====================================================

const db = require("../db/db");
const CREDIT_POLICY = require("../config/credit.policy");

module.exports = async function usageCheck(req, res, next) {
  try {
    if (process.env.DEV_MODE === "true") return next();

    const user = req.user;
    if (!user?.id) return res.status(401).json({ error: "UNAUTHORIZED" });

    // รับค่า Engine หรือ Alias จากหน้าบ้าน
    const engine = req.body?.alias || req.body?.engine;
    if (!engine) return res.status(400).json({ error: "ENGINE_REQUIRED" });

    const cost = CREDIT_POLICY.ENGINE_COST[engine];
    
    // ==========================================
    // [ZONE 1: ระบบใช้ฟรี 5 ครั้ง/วัน (FREEMIUM)]
    // ==========================================
    if (cost === 0 || engine.includes("_free")) {
      const identifier = user.email || req.ip; // ใช้ Email เป็นหลัก ถ้าไม่มีใช้ IP
      const today = new Date().toISOString().slice(0, 10); // รูปแบบ YYYY-MM-DD

      // 1. เช็คยอดการใช้งานวันนี้
      const usage = await db.getFreeUsage(identifier, today);
      
      if (usage && usage.used_count >= 5) {
        return res.status(403).json({ 
          error: "FREE_LIMIT_REACHED", 
          message: "โควตาฟรี 5 ครั้งต่อวันของคุณหมดแล้ว สนับสนุนพาร์ทเนอร์โดยการเติมเครดิตเพื่อใช้งานต่อ" 
        });
      }

      // 2. บันทึกยอดการใช้ฟรี (เพิ่มแต้ม)
      await db.updateFreeUsage(identifier, today);
      
      console.log(`FREE ACCESS → user:${identifier} engine:${engine} [5/${(usage?.used_count || 0) + 1}]`);
      return next(); // ข้ามขั้นตอนหักเงินไปเลย
    }

    // ==========================================
    // [ZONE 2: ระบบจ่ายเงิน (PAID - Option B)]
    // ==========================================
    if (cost === undefined) {
      return res.status(400).json({ error: "INVALID_ENGINE" });
    }

    const credits = await db.getUserCredits(user.id);

    if (credits < cost) {
      return res.status(402).json({ 
        error: "INSUFFICIENT_CREDIT",
        message: "เครดิตไม่พอสำหรับโมเดลพรีเมียม กรุณาเติมเงินเพื่อสนับสนุนระบบ"
      });
    }

    // ตัดเครดิตแบบ Atomic
    await db.deductCredit(user.id, cost, engine);

    console.log(`PAID ACCESS → user:${user.id} engine:${engine} cost:${cost}c`);
    next();

  } catch (err) {
    console.error("USAGE CHECK ERROR:", err);
    res.status(500).json({ error: "USAGE_CHECK_FAILED" });
  }
};
