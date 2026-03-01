/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: db/db.js
 * VERSION: v2.1.0
 * STATUS: production
 * LAST FIX: add credit system + slip reference protection
 */

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = process.env.DB_PATH || path.join(__dirname, "database.sqlite");

console.log("DB PATH:", dbPath);

const sqlite = new sqlite3.Database(dbPath);

// =====================================================
// AUTO CREATE TABLES (SAFE INIT)
// =====================================================

sqlite.serialize(() => {

  // เพิ่มคอลัมน์ credits ถ้ายังไม่มี
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      google_id TEXT,
      email TEXT,
      role TEXT DEFAULT 'user',
      credits INTEGER DEFAULT 0
    )
  `);

  // ตารางกันสลิปซ้ำ
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS slip_references (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ref TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

});

// ==============================
// GET USER BY GOOGLE ID
// ==============================

function getUserByGoogleId(googleId) {
  return new Promise((resolve, reject) => {
    sqlite.get(
      "SELECT * FROM users WHERE google_id = ?",
      [googleId],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
}

// ==============================
// CREATE USER
// ==============================

function createUser({ id, googleId, email, role }) {
  return new Promise((resolve, reject) => {
    sqlite.run(
      `INSERT INTO users (id, google_id, email, role) 
       VALUES (?, ?, ?, ?)`,
      [id, googleId, email, role || "user"],
      function (err) {
        if (err) return reject(err);
        resolve(id);
      }
    );
  });
}

// ==============================
// GET USER BY EMAIL
// ==============================

function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    sqlite.get(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
}

// =====================================================
// 🔥 ADD CREDIT (SAFE INCREMENT)
// =====================================================

function addCredit(userId, amount) {
  return new Promise((resolve, reject) => {
    sqlite.run(
      `UPDATE users 
       SET credits = COALESCE(credits,0) + ? 
       WHERE id = ?`,
      [amount, userId],
      function (err) {
        if (err) return reject(err);
        resolve(true);
      }
    );
  });
}

// =====================================================
// 🔥 CHECK SLIP USED
// =====================================================

function checkSlipReference(ref) {
  return new Promise((resolve, reject) => {
    sqlite.get(
      "SELECT * FROM slip_references WHERE ref = ?",
      [ref],
      (err, row) => {
        if (err) return reject(err);
        resolve(!!row);
      }
    );
  });
}

// =====================================================
// 🔥 SAVE SLIP REF
// =====================================================

function saveSlipReference(ref) {
  return new Promise((resolve, reject) => {
    sqlite.run(
      "INSERT INTO slip_references (ref) VALUES (?)",
      [ref],
      function (err) {
        if (err) return reject(err);
        resolve(true);
      }
    );
  });
}

module.exports = {
  sqlite,
  getUserByGoogleId,
  getUserByEmail,
  createUser,

  // 🔥 NEW EXPORTS
  addCredit,
  checkSlipReference,
  saveSlipReference
};

// ==============================
// ADD CREDIT
// ==============================

function addCredit(userId, amount) {
  return new Promise((resolve, reject) => {
    sqlite.serialize(() => {
      sqlite.run("BEGIN TRANSACTION");
      sqlite.run(
        "UPDATE users SET credit = COALESCE(credit,0) + ? WHERE id = ?",
        [amount, userId]
      );
      sqlite.run(
        `INSERT INTO transactions (id, user_id, type, amount, status)
         VALUES (?, ?, 'topup', ?, 'success')`,
        [require("uuid").v4(), userId, amount]
      );
      sqlite.run("COMMIT", (err) => {
        if (err) return reject(err);
        resolve(true);
      });
    });
  });
}

// ==============================
// DEDUCT CREDIT (ATOMIC)
// ==============================

function deductCredit(userId, amount, engine) {
  return new Promise((resolve, reject) => {
    sqlite.serialize(() => {
      sqlite.get(
        "SELECT credit FROM users WHERE id = ?",
        [userId],
        (err, row) => {
          if (err) return reject(err);
          if (!row || row.credit < amount)
            return reject(new Error("INSUFFICIENT_CREDIT"));

          sqlite.run("BEGIN TRANSACTION");
          sqlite.run(
            "UPDATE users SET credit = credit - ? WHERE id = ?",
            [amount, userId]
          );
          sqlite.run(
            `INSERT INTO transactions
             (id, user_id, type, amount, engine, status)
             VALUES (?, ?, 'render', ?, ?, 'success')`,
            [require("uuid").v4(), userId, amount, engine]
          );
          sqlite.run("COMMIT", (err2) => {
            if (err2) return reject(err2);
            resolve(true);
          });
        }
      );
    });
  });
}

module.exports.addCredit = addCredit;
module.exports.deductCredit = deductCredit;
