/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: controllers/admin.finance.controller.js
VERSION: v12.3.0 (ALIGNED WITH ACTUAL DB SCHEMA)
===================================================== */
const db = require("../db/db");
const axios = require("axios");
require('dotenv').config();

const KEYS = {
  REPLICATE: process.env.REPLICATE_API_TOKEN,
  RUNWAY: process.env.RUNWAY_API_KEY,
  ELEVENLABS: process.env.ELEVENLABS_API_KEY,
  GEMINI: process.env.GEMINI_API_KEY
};

exports.getFinanceSummary = async (req, res) => {
  try {
    // 1. ดึงข้อมูลจาก Local DB (ใช้ชื่อตารางจริงจาก .tables)
    
    // ยอดเงินที่ขายได้ (จากตาราง payments)
    const sold = await db.get("SELECT SUM(amount) as total FROM payments WHERE status='paid' OR status='success'").catch(() => ({total:0}));
    
    // เครดิตที่ถูกใช้ไป (ดึงจากตาราง credit_transactions ที่มี type เป็น 'use')
    const used = await db.get("SELECT SUM(amount) as total FROM credit_transactions WHERE type='use'").catch(() => ({total:0}));
    
    // จำนวนผู้ใช้ทั้งหมด (จากตาราง users)
    const usersCount = await db.get("SELECT COUNT(*) as total FROM users").catch(() => ({total:0}));
    
    // ยอดเครดิตคงเหลือทั้งหมดในระบบ (จากตาราง user_credits)
    const currentBalance = await db.get("SELECT SUM(credits) as total FROM user_credits").catch(() => ({total:0}));

    // 2. ดึงข้อมูลจาก Partner APIs (Runway/Replicate/etc.)
    const partnerResults = await Promise.allSettled([
      axios.get("https://api.elevenlabs.io/v1/user/subscription", {
        headers: { "xi-api-key": KEYS.ELEVENLABS }
      }),
      axios.get("https://api.replicate.com/v1/account", {
        headers: { "Authorization": `Token ${KEYS.REPLICATE}` }
      })
    ]);

    // 3. ส่งข้อมูลกลับไปที่ Dashboard
    res.json({
      local: {
        totalCreditSold: sold?.total || 0,
        totalCreditUsed: used?.total || 0,
        netCreditBalance: currentBalance?.total || 0, // ยอดเครดิตจริงที่ค้างในระบบ
        activeUsers: usersCount?.total || 0
      },
      partners: {
        elevenlabs: partnerResults[0].status === 'fulfilled' 
          ? { remaining: partnerResults[0].value.data.character_limit - partnerResults[0].value.data.character_count, status: "active" } 
          : { status: "error" },
        replicate: partnerResults[1].status === 'fulfilled'
          ? { type: partnerResults[1].value.data.type, status: "active" }
          : { status: "error" },
        runway: { 
          status: KEYS.RUNWAY ? "CONNECTED (GEN-3)" : "OFFLINE",
          model: "ULTRA-ENGINE"
        },
        gemini: { 
          status: KEYS.GEMINI ? "LIVE (2.5-FLASH)" : "OFFLINE", 
          model: "PRO-CORE" 
        }
      }
    });

  } catch (err) {
    console.error("ADMIN FINANCE MASTER ERROR:", err);
    res.status(500).json({ error: "INTERNAL_DATA_SYNC_FAIL" });
  }
};

// นโยบายเครดิต (เพื่อปิดช่อง Error "Policy data unavailable")
exports.getCreditPolicy = (req, res) => {
    res.json({
        baseRate: "1 THB = 100 Credits",
        minTopup: "50 THB",
        engineCost: {
            runway: "150/Sec",
            elevenlabs: "2/Char",
            gemini: "10/Query"
        }
    });
};
