/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: services/fraud.guard.js
 * VERSION: v9.0.0
 * STATUS: production
 * LAST FIX:
 * - add fraud detection
 * - detect rapid payment attempts
 * - add-only module
 * =====================================================
 */

const db = require("../db/db");

exports.detectFraud = async (userId)=>{

  try{

    const rows = await db.all(`
      SELECT COUNT(*) as cnt
      FROM payments
      WHERE user_id=?
      AND created_at > datetime('now','-10 minutes')
    `,[userId]);

    if(rows[0].cnt > 5){
      console.warn("FRAUD ALERT:",userId);
      return true;
    }

    return false;

  }catch(err){

    console.error("FRAUD CHECK ERROR",err);
    return false;

  }

};
