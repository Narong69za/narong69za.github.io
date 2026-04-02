/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: controllers/admin.finance.controller.js
 * VERSION: v11.6.0 (FINAL MASTER - SYNC FIXED)
 * =====================================================
 */
const db = require("../db/db");
const axios = require("axios");
require('dotenv').config();

const KEYS = {
  REPLICATE: process.env.REPLICATE_API_TOKEN,
  ELEVENLABS: process.env.ELEVENLABS_API_KEY
};

// Helper สำหรับ Query ให้ใช้ตัวเดียวกับ admin.routes
const query = (sql) => new Promise((res, rej) => {
  db.sqlite.get(sql, [], (err, row) => err ? rej(err) : res(row));
});

exports.getFinanceSummary = async (req, res) => {
  try {
    // 1. ดึงข้อมูลจาก Local SQLite
    const sold = await query("SELECT SUM(amount) as total FROM payment_logs WHERE status='success'");
    const users = await query("SELECT COUNT(*) as total FROM users");

    // 2. ดึงข้อมูลจาก Partner APIs (ElevenLabs & Replicate)
    const partnerResults = await Promise.allSettled([
      axios.get("https://api.elevenlabs.io/v1/user/subscription", {
        headers: { "xi-api-key": KEYS.ELEVENLABS }
      }),
      axios.get("https://api.replicate.com/v1/account", {
        headers: { "Authorization": `Token ${KEYS.REPLICATE}` }
      })
    ]);

    // 3. รวมข้อมูลส่งออก
    res.json({
      local: {
        totalCreditSold: sold?.total || 0,
        totalCreditUsed: 0, 
        netCreditBalance: (sold?.total || 0) * 100,
        activeUsers: users?.total || 0
      },
      partners: {
        elevenlabs: partnerResults[0].status === 'fulfilled' 
          ? { remaining: partnerResults[0].value.data.character_limit - partnerResults[0].value.data.character_count, status: "active" } 
          : { status: "error" },
        replicate: partnerResults[1].status === 'fulfilled'
          ? { type: partnerResults[1].value.data.type, status: "active" }
          : { status: "error" },
        runway: { status: "connected", model: "gen4.5" },
        gemini: { status: "connected", model: "2.5-flash" }
      }
    });
  } catch (err) {
    res.status(500).json({ error: "FINANCE_OVERVIEW_FAIL" });
  }
};

