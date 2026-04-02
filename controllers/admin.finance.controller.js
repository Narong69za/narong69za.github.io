/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: admin.finance.controller.js (STORED ON FRONTEND)
VERSION: v14.0.0 (CROSS-PATH DB LINK)
===================================================== */
// บังคับโหลด DB จาก Path ของ Backend โดยตรงเพื่อกันหลงทาง
const db = require("/home/ubuntu/sn-payment-core/db"); 
const axios = require("axios");

exports.getFinanceSummary = async (req, res) => {
  try {
    const sold = await db.get("SELECT SUM(amount) as total FROM payments WHERE status IN ('paid','success')").catch(() => ({total:0}));
    const used = await db.get("SELECT SUM(amount) as total FROM credit_transactions WHERE type='use'").catch(() => ({total:0}));
    const usersCount = await db.get("SELECT COUNT(*) as total FROM users").catch(() => ({total:0}));
    const userCredits = await db.get("SELECT SUM(credits) as total FROM user_credits").catch(() => ({total:0}));

    res.json({
      local: {
        totalCreditSold: sold?.total || 0,
        totalCreditUsed: used?.total || 0,
        netCreditBalance: userCredits?.total || 0,
        activeUsers: usersCount?.total || 0
      },
      partners: {
        runway: {
          status: process.env.RUNWAY_API_KEY ? "CONNECTED" : "OFFLINE",
          balance: "1,000 Credits (Pool)", // ยอด 1,000 ตามจริง
          model: "Gen-3 Alpha"
        },
        gemini: {
          status: process.env.GEMINI_API_KEY ? "LIVE" : "OFFLINE",
          model: "2.5-FLASH"
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: "DB_ACCESS_FAIL" });
  }
};

exports.getCreditPolicy = (req, res) => {
    res.json({
        baseRate: "1 THB = 100 Credits",
        minTopup: "5 THB",
        engineCost: { runway: "150/Sec", gemini: "10/Query" }
    });
};

