// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: routes/admin.routes.js
// VERSION: v11.7.0 (MATCHING FRONTEND FETCH CALLS)
// =====================================================

const express = require("express");
const router = express.Router();
const db = require("../db/db");
const CREDIT_POLICY = require("../config/credit.policy");
const adminFinanceController = require('../controllers/admin.finance.controller');

// 1. ดึงข้อมูลภาพรวม (Dashboard Cards)
// หน้าบ้านเรียก: /admin/overview
router.get("/overview", adminFinanceController.getFinanceSummary);

// 2. ดึงนโยบายเครดิต (Credit Policy Board)
// หน้าบ้านเรียก: /admin/credit-policy
router.get("/credit-policy", (req, res) => {
  res.json({
    baseRate: CREDIT_POLICY.BASE_RATE || "1 THB = 100 Credits",
    minTopup: CREDIT_POLICY.MIN_TOPUP_THB || 50,
    engineCost: CREDIT_POLICY.ENGINE_COST || { runway: 150, gemini: 10 }
  });
});

// 3. ดึงรายการล่าสุด (Recent Transactions Table)
// หน้าบ้านเรียก: /admin/recent
router.get("/recent", async (req, res) => {
  try {
    const rows = await queryAll(`
      SELECT user_id, method, amount, currency, status, created_at 
      FROM payment_logs 
      ORDER BY created_at DESC LIMIT 50
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "RECENT_FAIL" });
  }
});

// 4. ดึงกราฟรายวัน (Daily Chart)
// หน้าบ้านเรียก: /admin/daily
router.get("/daily", async (req, res) => {
  try {
    const rows = await queryAll(`
      SELECT DATE(created_at) as date, SUM(amount) as total 
      FROM credit_transactions 
      WHERE type='topup' OR type='add' 
      GROUP BY DATE(created_at) 
      ORDER BY DATE(created_at) ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "DAILY_FAIL" });
  }
});

// --- HELPERS ---
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
