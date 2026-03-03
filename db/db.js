// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: db/db.js
// VERSION: v9.1.0
// STATUS: production-final
// LAYER: core
// RESPONSIBILITY:
// - database connection
// - user management
// - atomic credit system
// - transaction logging
// DEPENDS ON:
// - config/system.config.js
// LAST FIX:
// - centralized DB_PATH
// - fixed db reference bug
// - production stable export
// =====================================================

const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const config = require("../config/system.config");

const dbPath =
  config.DB_PATH || path.join(__dirname, "database.sqlite");

console.log("DB PATH:", dbPath);

const sqlite = new sqlite3.Database(dbPath);

// =====================================================
// AUTO CREATE TABLES
// =====================================================

sqlite.serialize(() => {

  sqlite.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      google_id TEXT,
      email TEXT,
      role TEXT DEFAULT 'user',
      credits INTEGER DEFAULT 0
    )
  `);

  sqlite.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      type TEXT,
      amount INTEGER,
      engine TEXT,
      status TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  sqlite.run(`
    CREATE TABLE IF NOT EXISTS payment_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      method TEXT,
      amount INTEGER,
      currency TEXT,
      status TEXT,
      tx_id TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  sqlite.run(`
    CREATE TABLE IF NOT EXISTS slip_references (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ref TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

});

// =====================================================
// USER FUNCTIONS
// =====================================================

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

// =====================================================
// CREDIT SYSTEM (ATOMIC)
// =====================================================

function addCredit(userId, amount) {
  return new Promise((resolve, reject) => {

    sqlite.serialize(() => {

      sqlite.run("BEGIN TRANSACTION");

      sqlite.run(
        "UPDATE users SET credits = COALESCE(credits,0) + ? WHERE id = ?",
        [amount, userId]
      );

      sqlite.run(
        `INSERT INTO transactions
         (id, user_id, type, amount, status)
         VALUES (?, ?, 'topup', ?, 'success')`,
        [uuidv4(), userId, amount]
      );

      sqlite.run("COMMIT", (err) => {
        if (err) return reject(err);
        resolve(true);
      });

    });

  });
}

function deductCredit(userId, amount, engine) {
  return new Promise((resolve, reject) => {

    sqlite.get(
      "SELECT credits FROM users WHERE id = ?",
      [userId],
      (err, row) => {

        if (err) return reject(err);
        if (!row || row.credits < amount)
          return reject(new Error("INSUFFICIENT_CREDIT"));

        sqlite.serialize(() => {

          sqlite.run("BEGIN TRANSACTION");

          sqlite.run(
            "UPDATE users SET credits = credits - ? WHERE id = ?",
            [amount, userId]
          );

          sqlite.run(
            `INSERT INTO transactions
             (id, user_id, type, amount, engine, status)
             VALUES (?, ?, 'render', ?, ?, 'success')`,
            [uuidv4(), userId, amount, engine]
          );

          sqlite.run("COMMIT", (err2) => {
            if (err2) return reject(err2);
            resolve(true);
          });

        });

      }
    );

  });
}

// =====================================================
// SLIP
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

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  sqlite,
  getUserByEmail,
  createUser,
  addCredit,
  deductCredit,
  checkSlipReference,
  saveSlipReference
};
