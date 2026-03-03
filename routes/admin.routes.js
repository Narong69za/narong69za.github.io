// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: routes/admin.routes.js
// VERSION: v9.0.0
// STATUS: production-final
// LAYER: admin
// RESPONSIBILITY:
// - finance summary
// - transaction analytics
// DEPENDS ON:
// - db/db.js
// =====================================================

const express = require("express");
const router = express.Router();
const db = require("../db/db");

// ================================
// FINANCE SUMMARY
// ================================

router.get("/finance-summary", async (req, res) => {

  try {

    const totalTopup = await queryOne(`
      SELECT COALESCE(SUM(amount),0) as total
      FROM transactions
      WHERE type='topup'
    `);

    const totalRender = await queryOne(`
      SELECT COALESCE(SUM(amount),0) as total
      FROM transactions
      WHERE type='render'
    `);

    const totalUsers = await queryOne(`
      SELECT COUNT(*) as total
      FROM users
    `);

    const totalSuccessfulPayments = await queryOne(`
      SELECT COUNT(*) as total
      FROM payment_logs
      WHERE status='success'
    `);

    return res.json({
      revenueCredits: totalTopup.total,
      usedCredits: totalRender.total,
      activeUsers: totalUsers.total,
      successfulPayments: totalSuccessfulPayments.total,
      netCreditBalance: totalTopup.total - totalRender.total
    });

  } catch (err) {

    console.error("FINANCE SUMMARY ERROR:", err);
    return res.status(500).json({ error: "FINANCE_SUMMARY_FAILED" });

  }

});

// ================================
// DAILY REVENUE CHART
// ================================

router.get("/finance-daily", async (req, res) => {

  try {

    const rows = await queryAll(`
      SELECT DATE(created_at) as date,
             SUM(amount) as total
      FROM payment_logs
      WHERE status='success'
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) ASC
    `);

    return res.json(rows);

  } catch (err) {

    console.error("FINANCE DAILY ERROR:", err);
    return res.status(500).json({ error: "FINANCE_DAILY_FAILED" });

  }

});

// ================================
// RECENT PAYMENTS TABLE
// ================================

router.get("/finance-recent", async (req, res) => {

  try {

    const rows = await queryAll(`
      SELECT user_id,
             method,
             amount,
             currency,
             status,
             created_at
      FROM payment_logs
      ORDER BY created_at DESC
      LIMIT 50
    `);

    return res.json(rows);

  } catch (err) {

    console.error("FINANCE RECENT ERROR:", err);
    return res.status(500).json({ error: "FINANCE_RECENT_FAILED" });

  }

});

// ================================
// Helper
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
