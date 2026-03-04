/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: controllers/admin.finance.controller.js
 * VERSION: v9.0.0
 * STATUS: production
 * LAST FIX:
 * - added finance summary
 * - added finance daily analytics
 * - add-only safe controller
 * =====================================================
 */

const db = require("../db/db");

exports.getFinanceSummary = async (req,res)=>{

  try{

    const sold = await db.get(`
      SELECT SUM(amount) as total FROM payments WHERE status='paid'
    `);

    const used = await db.get(`
      SELECT SUM(credits_used) as total FROM ai_jobs
    `);

    const users = await db.get(`
      SELECT COUNT(*) as total FROM users
    `);

    res.json({
      totalCreditSold: sold?.total || 0,
      totalCreditUsed: used?.total || 0,
      netCreditBalance: (sold?.total||0)-(used?.total||0),
      activeUsers: users?.total || 0
    });

  }catch(err){

    console.error("FINANCE SUMMARY ERROR",err);
    res.status(500).json({error:"FINANCE_SUMMARY_FAIL"});

  }

};


exports.getFinanceDaily = async (req,res)=>{

  try{

    const rows = await db.all(`
      SELECT 
      date(created_at) as date,
      SUM(amount) as total
      FROM payments
      WHERE status='paid'
      GROUP BY date(created_at)
      ORDER BY date ASC
    `);

    res.json(rows);

  }catch(err){

    console.error("FINANCE DAILY ERROR",err);
    res.status(500).json({error:"FINANCE_DAILY_FAIL"});

  }

};


exports.getFinanceRecent = async (req,res)=>{

  try{

    const rows = await db.all(`
      SELECT user_id,method,amount,currency,status,created_at
      FROM payments
      ORDER BY created_at DESC
      LIMIT 50
    `);

    res.json(rows);

  }catch(err){

    console.error("FINANCE RECENT ERROR",err);
    res.status(500).json({error:"FINANCE_RECENT_FAIL"});

  }

};
