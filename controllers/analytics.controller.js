/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: controllers/analytics.controller.js
 * VERSION: v9.0.0
 * STATUS: production
 * LAST FIX:
 * - added credit burn analytics
 * - add-only analytics module
 * =====================================================
 */

const db = require("../db/db");

exports.creditBurn = async (req,res)=>{

  try{

    const rows = await db.all(`
      SELECT 
      date(created_at) as date,
      SUM(credits_used) as burn
      FROM ai_jobs
      GROUP BY date(created_at)
      ORDER BY date ASC
    `);

    res.json(rows);

  }catch(err){

    console.error("CREDIT BURN ERROR",err);
    res.status(500).json({error:"CREDIT_BURN_FAIL"});

  }

};
