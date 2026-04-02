/* =====================================================
VERSION: v13.1.0 (CENTRAL POOL & DB FIX)
===================================================== */
const db = require("../db/db");
const axios = require("axios");

exports.getFinanceSummary = async (req, res) => {
  try {
    // 1. ดึงข้อมูลจากตารางจริงใน DB ของคุณ
    const sold = await db.get("SELECT SUM(amount) as total FROM payments WHERE status IN ('paid','success')").catch(() => ({total:0}));
    const used = await db.get("SELECT SUM(amount) as total FROM credit_transactions WHERE type='use'").catch(() => ({total:0}));
    const users = await db.get("SELECT COUNT(*) as total FROM users").catch(() => ({total:0}));
    const userCredits = await db.get("SELECT SUM(credits) as total FROM user_credits").catch(() => ({total:0}));

    // 2. ดึงสถานะ Partner (ElevenLabs/Replicate) - ถ้า Error ให้ส่งเป็น 0 ไม่ให้หน้าบ้านค้าง
    const elevenLabs = await axios.get("https://api.elevenlabs.io/v1/user/subscription", {
        headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY }
    }).catch(() => null);

    // 3. ส่งข้อมูลกลับ (แสดงผล 10,000 Credits ของ Runway ตามที่คุณเติมไว้)
    res.json({
      local: {
        totalCreditSold: sold?.total || 0,
        totalCreditUsed: used?.total || 0,
        netCreditBalance: userCredits?.total || 0,
        activeUsers: users?.total || 0
      },
      partners: {
        runway: {
          status: process.env.RUNWAY_API_KEY ? "CONNECTED (READY)" : "OFFLINE",
          balance: "10,000 Credits (Central Pool)", // <--- ยอดที่คุณตุนไว้จะโชว์ตรงนี้
          model: "Gen-3 Alpha"
        },
        gemini: {
          status: process.env.GEMINI_API_KEY ? "LIVE (2.5-FLASH)" : "OFFLINE",
          model: "PRO-CORE"
        },
        elevenlabs: elevenLabs ? {
          remaining: elevenLabs.data.character_limit - elevenLabs.data.character_count,
          status: "active"
        } : { status: "error" },
        replicate: { status: process.env.REPLICATE_API_TOKEN ? "READY" : "OFFLINE" }
      }
    });
  } catch (err) {
    res.status(500).json({ error: "INTERNAL_ERROR" });
  }
};

