// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: routes/admin.routes.js
// VERSION: v11.6.0 (FINAL PRODUCTION MASTER)
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
router.get("/realtime-status", monitorController.getRealtimeStatus);
router.get("/finance/overview", adminFinanceController.getFinanceSummary);

// ================================
// FINANCE SUMMARY (LEGACY SUPPORT)
// ================================
router.get("/finance-summary", async (req, res) => {
  try {
    const totalTopup = await queryOne("SELECT COALESCE(SUM(amount),0) as total FROM transactions WHERE type='topup'");
    const totalRender = await queryOne("SELECT COALESCE(SUM(amount),0) as total FROM transactions WHERE type='render'");
    const totalUsers = await queryOne("SELECT COUNT(*) as total FROM users");
    const totalSuccessfulPayments = await queryOne("SELECT COUNT(*) as total FROM payment_logs WHERE status='success'");

    res.json({
      totalCreditSold: totalTopup.total,
      totalCreditUsed: totalRender.total,
      netCreditBalance: totalTopup.total - totalRender.total,
      activeUsers: totalUsers.total,
      successfulPayments: totalSuccessfulPayments.total
    });
  } catch (err) {
    res.status(500).json({ error: "FINANCE_SUMMARY_FAILED" });
  }
});

// ================================
// DAILY ANALYTICS & RECENT PAYMENTS
// ================================
router.get("/finance-daily", async (req, res) => {
  try {
    const rows = await queryAll("SELECT DATE(created_at) as date, SUM(amount) as total FROM transactions WHERE type='topup' GROUP BY DATE(created_at) ORDER BY DATE(created_at) ASC");
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

router.get("/credit-policy", (req, res) => {
  res.json({
    baseRate: CREDIT_POLICY.BASE_RATE,
    minTopup: CREDIT_POLICY.MIN_TOPUP_THB,
    binanceRate: CREDIT_POLICY.BINANCE_THB_RATE,
    bonusTiers: CREDIT_POLICY.BONUS_TIERS,
    engineCost: CREDIT_POLICY.ENGINE_COST
  });
});

// ================================
// HELPERS (DB SQLITE BRIDGE)
// ================================
function queryOne(sql) {
  return new Promise((resolve, reject) => {
    db.sqlite.get(sql, [], (err, row) => {
      if (err) return reject(err);
      resolve(row || { total: 0 });
    });
  });
}

function queryAll(sql) {
  return new Promise((resolve, reject) => {
    db.sqlite.all(sql, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
}

module.exports = router;

