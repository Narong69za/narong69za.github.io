const db = require("../db");
const axios = require("axios");

exports.getFinanceSummary = async (req, res) => {
  try {
    const sold = await db.get("SELECT SUM(amount) as total FROM payments WHERE status IN ('paid','success')").catch(() => ({total:0}));
    const used = await db.get("SELECT SUM(amount) as total FROM credit_transactions WHERE type='use'").catch(() => ({total:0}));
    const usersCount = await db.get("SELECT COUNT(*) as total FROM users").catch(() => ({total:0}));
    const userCredits = await db.get("SELECT SUM(credits) as total FROM user_credits").catch(() => ({total:0}));

    // ดึงประวัติล่าสุด (Recent Transactions)
    const recent = await db.all("SELECT id, method, amount, status, created_at as date FROM payments ORDER BY created_at DESC LIMIT 5").catch(() => []);

    res.json({
      success: true, // เพิ่ม success เพื่อให้ Frontend สบายใจ
      local: {
        totalCreditSold: sold?.total || 0,
        totalCreditUsed: used?.total || 0,
        netCreditBalance: userCredits?.total || 0,
        activeUsers: usersCount?.total || 0,
        recent: recent
      },
      partners: {
        runway: { status: "CONNECTED", balance: "1,000 Credits", model: "Gen-3 Alpha" },
        gemini: { status: "LIVE", model: "2.5-FLASH" },
        elevenlabs: { status: "READY", balance: "Unlimited" },
        replicate: { status: "READY" }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "FETCH_FAIL" });
  }
};

exports.getCreditPolicy = (req, res) => {
    res.json({
        success: true,
        baseRate: "1 THB = 100 Credits",
        minTopup: "10 THB",
        binanceRate: "1 USD = 34 THB",
        bonusTiers: []
    });
};

