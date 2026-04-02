// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: routes/admin.routes.js
// VERSION: v11.6.1 (FIXED TABLE NAMES & CONTROLLERS)
// STATUS: production-final
// LAYER: admin
// =====================================================

const express = require("express");
const router = express.Router();
const db = require("../db/db");
const CREDIT_POLICY = require("../config/credit.policy");

// นำเข้า Controllers
const monitorController = require('../services/monitor.controller');
const adminFinanceController = require('../controllers/admin.finance.controller');

// ================================
// [INJECTED] SYSTEM MONITOR & FINANCE OVERVIEW
// ================================
// เส้นทางนี้จะส่งข้อมูลให้หน้า Dashboard ตัวใหม่ (รองรับ Runway/Replicate/etc.)
router.get("/realtime-status", monitorController.getRealtimeStatus);
router.get("/finance/overview", adminFinanceController.getFinanceSummary);

// ================================
// FINANCE SUMMARY (LEGACY SUPPORT - FIXED)
// ================================
router.get("/finance-summary", async (req, res) => {
  try {
    // [FIXED] เปลี่ยนชื่อตารางจาก transactions เป็น credit_transactions ให้ตรงกับ DB จริง
    const totalTopup = await queryOne("SELECT COALESCE(SUM(amount),0) as total FROM credit_transactions WHERE type='topup' OR type='add'");
    const totalRender = await queryOne("SELECT COALESCE(SUM(amount),0) as total FROM credit_transactions WHERE type='render' OR type='use'");
    const totalUsers = await queryOne("SELECT COUNT(*) as total FROM users");
    const totalSuccessfulPayments = await queryOne("SELECT COUNT(*) as total FROM payment_logs WHERE status='success' OR status='paid'");

    res.json({
      totalCreditSold: totalTopup.total,
      totalCreditUsed: totalRender.total,
      netCreditBalance: totalTopup.total - totalRender.total,
      activeUsers: totalUsers.total,
      successfulPayments: totalSuccessfulPayments.total
    });
  } catch (err) {
    console.error("FINANCE_SUMMARY_ERROR:", err);
    res.status(500).json({ error: "FINANCE_SUMMARY_FAILED" });
  }
});

// ================================
// DAILY ANALYTICS & RECENT PAYMENTS
// ================================
router.get("/finance-daily", async (req, res) => {
  try {
    // [FIXED] เปลี่ยนชื่อตารางเป็น credit_transactions
    const rows = await queryAll("SELECT DATE(created_at) as date, SUM(amount) as total FROM credit_transactions WHERE type='topup' OR type='add' GROUP BY DATE(created_at) ORDER BY DATE(created_at) ASC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "FINANCE_DAILY_FAILED" });
  }
});

router.get("/finance-recent", async (req, res) => {
  try {
    const rows = await queryAll("SELECT user_id, method, amount, currency, status, created_at FROM payment_logs ORDER BY created_at DESC LIMIT 50");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "FINANCE_RECENT_FAILED" });
  }
});

// นโยบายเครดิต (ใช้ค่าจาก config/credit.policy.js)
router.get("/credit-policy", (req, res) => {
  try {
    res.json({
      baseRate: CREDIT_POLICY.BASE_RATE,
      minTopup: CREDIT_POLICY.MIN_TOPUP_THB,
      binanceRate: CREDIT_POLICY.BINANCE_THB_RATE,
      bonusTiers: CREDIT_POLICY.BONUS_TIERS,
      engineCost: CREDIT_POLICY.ENGINE_COST
    });
  } catch (err) {
    // Fallback ในกรณีไฟล์ config มีปัญหา
    res.json({
      baseRate: "1 THB = 100 Credits",
      minTopup: 50,
      engineCost: { runway: 150, gemini: 10 }
    });
  }
});

// ================================
// HELPERS (DB SQLITE BRIDGE)
// ================================
function queryOne(sql) {
  return new Promise((resolve, reject) => {
    // ใช้ db.sqlite หรือ db ตามโครงสร้างไฟล์ db.js ของคุณ
    const connection = db.sqlite || db;
    connection.get(sql, [], (err, row) => {
      if (err) return reject(err);
      resolve(row || { total: 0 });
    });
  });
}

function queryAll(sql) {
  return new Promise((resolve, reject) => {
    const connection = db.sqlite || db;
    connection.all(sql, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
}

module.exports = router;
