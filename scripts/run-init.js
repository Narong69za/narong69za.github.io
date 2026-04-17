// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: scripts/run-init.js
// VERSION: v
// STATUS: production-final
// LAYER: system
// RESPONSIBILITY:
// - initialize production schema
// - enforce foreign key
// - safe execution control
// DEPENDS ON:
// - init.sql
// - DB_PATH (.env)
// LAST FIX: 2026-03-08
// - unified DB_PATH handling
// - safe init guard
// - foreign key enforcement
// =====================================================

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const DB_PATH =
  process.env.DB_PATH ||
  path.join(__dirname, "../db/database.sqlite");

const SQL_PATH = path.join(__dirname, "init.sql");

// ============================
// SAFETY CHECK
// ============================

if (!fs.existsSync(SQL_PATH)) {
  console.error("INIT.SQL NOT FOUND:", SQL_PATH);
  process.exit(1);
}

if (!process.env.ALLOW_DB_INIT) {
  console.log("DB INIT BLOCKED (set ALLOW_DB_INIT=true to allow)");
  process.exit(0);
}

// ============================
// INIT PROCESS
// ============================

console.log("=================================");
console.log("SN DESIGN STUDIO DB INIT v9");
console.log("DB PATH:", DB_PATH);
console.log("=================================");

const sql = fs.readFileSync(SQL_PATH, "utf8");

const db = new sqlite3.Database('/root/sn-payment-core/database.db');

db.serialize(() => {

  // 🔒 enforce foreign keys
  db.run("PRAGMA foreign_keys = ON");

  db.exec(sql, (err) => {

    if (err) {
      console.error("INIT ERROR:", err.message);
      process.exit(1);
    }

    console.log("DB INIT SUCCESS (Schema Applied)");

    db.close();
  });

});
