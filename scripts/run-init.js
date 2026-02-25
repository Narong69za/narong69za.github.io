// ========================================
// SN DESIGN STUDIO DB INIT RUNNER
// FULL VERSION
// ========================================

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const pool = require("../src/db/db"); // ใช้ db.js เดิม

async function run() {

   try {

      const sqlPath = path.join(__dirname, "init.sql");

      const sql = fs.readFileSync(sqlPath, "utf8");

      await pool.query(sql);

      console.log("✅ DATABASE INIT COMPLETE");

      process.exit();

   } catch (err) {

      console.error("❌ INIT ERROR:", err);

      process.exit(1);

   }

}

run();
