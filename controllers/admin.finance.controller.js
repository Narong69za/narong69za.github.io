/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: controllers/admin.finance.controller.js
 * VERSION: v11.5.0 (FINAL PRODUCTION MASTER)
 * =====================================================
 */

const db = require("../db/db");
const axios = require("axios");
require('dotenv').config(); // โหลดค่าจาก .env

const KEYS = {
  REPLICATE: process.env.REPLICATE_API_TOKEN,
  RUNWAY: process.env.RUNWAY_API_KEY,
  ELEVENLABS: process.env.ELEVENLABS_API_KEY,
  GEMINI: process.env.GEMINI_API_KEY
};

exports.getFinanceSummary = async (req, res) => {
  try {
    // 1. ดึงข้อมูลจาก Local SQLite (การเงินในระบบ)
    const sold = await db.get("SELECT SUM(amount) as total FROM payments WHERE status='paid'");
    const used = await db.get("SELECT SUM(credits_used) as total FROM ai_jobs");
    const users = await db.get("SELECT COUNT(*) as total FROM users");

    // 2. ดึงข้อมูล Real-time จาก Partner APIs
    const partnerResults = await Promise.allSettled([
      // ElevenLabs Characters Remaining
      axios.get("https://api.elevenlabs.io/v1/user/subscription", {
        headers: { "xi-api-key": KEYS.ELEVENLABS }
      }),
      // Replicate Account Status
      axios.get("https://api.replicate.com/v1/account", {
        headers: { "Authorization": `Token ${KEYS.REPLICATE}` }
      })
    ]);

    // 3. รวมข้อมูลเพื่อส่งให้ Dashboard (1 THB = 100 Credits)
    res.json({
      local: {
        totalCreditSold: sold?.total || 0,
        totalCreditUsed: used?.total || 0,
        netCreditBalance: ((sold?.total || 0) * 100) - (used?.total || 0),
        activeUsers: users?.total || 0
      },
      partners: {
        elevenlabs: partnerResults[0].status === 'fulfilled' 
          ? {
              remaining: partnerResults[0].value.data.character_limit - partnerResults[0].value.data.character_count,
              status: "active"
            } 
          : { status: "error" },
        replicate: partnerResults[1].status === 'fulfilled'
          ? { type: partnerResults[1].value.data.type, status: "active" }
          : { status: "error" },
        runway: { status: "connected", model: "gen4.5" },
        gemini: { status: "connected", model: "2.5-flash" }
      }
    });

  } catch (err) {
    console.error("ADMIN FINANCE MASTER ERROR", err);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

// --- Daily Analytics ---
exports.getFinanceDaily = async (req, res) => {
  try {
    const rows = await db.all(`
      SELECT date(created_at) as date, SUM(amount) as total
      FROM payments WHERE status='paid'
      GROUP BY date(created_at) ORDER BY date ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "DAILY_ANALYTICS_FAIL" });
  }
};

// --- Recent Transactions ---
exports.getFinanceRecent = async (req, res) => {
  try {
    const rows = await db.all(`
      SELECT user_id, method, amount, currency, status, created_at
      FROM payments ORDER BY created_at DESC LIMIT 50
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "RECENT_TX_FAIL" });
  }
};
      
