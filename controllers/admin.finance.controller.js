/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: controllers/admin.finance.controller.js
VERSION: v13.6.0 (CENTRAL POOL 1,000 & DB ALIGNED)
===================================================== */
const db = require("../db/db");
const axios = require("axios");

exports.getFinanceSummary = async (req, res) => {
  try {
    // 1. ดึงข้อมูลจากฐานข้อมูลจริง (ใช้ชื่อตารางที่คุณเช็คจาก .tables)
    const sold = await db.get("SELECT SUM(amount) as total FROM payments WHERE status IN ('paid','success')").catch(() => ({total:0}));
    const used = await db.get("SELECT SUM(amount) as total FROM credit_transactions WHERE type='use'").catch(() => ({total:0}));
    const usersCount = await db.get("SELECT COUNT(*) as total FROM users").catch(() => ({total:0}));
    const userCredits = await db.get("SELECT SUM(credits) as total FROM user_credits").catch(() => ({total:0}));

    // 2. ดึงสถานะ Partner (ElevenLabs)
    const elevenLabs = await axios.get("https://api.elevenlabs.io/v1/user/subscription", {
        headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY }
    }).catch(() => null);

    // 3. ส่งข้อมูลกลับ (รวมยอด 1,000 Credits ส่วนกลางของ RunwayML)
    res.json({
      local: {
        totalCreditSold: sold?.total || 0,
        totalCreditUsed: used?.total || 0,
        netCreditBalance: userCredits?.total || 0,
        activeUsers: usersCount?.total || 0
      },
      partners: {
        runway: {
          status: process.env.RUNWAY_API_KEY ? "CONNECTED (READY)" : "OFFLINE",
          balance: "1,000 Credits (Central Pool)", // <--- ปรับเป็น 1,000 ตามจริงแล้วครับ
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
        replicate: { 
          status: process.env.REPLICATE_API_TOKEN ? "READY" : "OFFLINE" 
        }
      }
    });
  } catch (err) {
    console.error("ADMIN_FINANCE_ERROR:", err);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

exports.getCreditPolicy = (req, res) => {
    res.json({
        baseRate: "1 THB = 100 Credits",
        minTopup: "10 THB",
        engineCost: { runway: "150/Sec", gemini: "10/Query" }
    });
};

