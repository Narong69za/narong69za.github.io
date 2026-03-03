// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: db/db.js
// VERSION: v9.1.0
// STATUS: production-final
// LAYER: core
// RESPONSIBILITY:
// - database connection
// - production schema enforcement
// - atomic credit ledger system
// - payment idempotent protection
// DEPENDS ON:
// - sqlite3
// - config/system.config.js
// LAST FIX:
// - unified production schema (user_credits)
// - removed legacy users.credits
// - atomic ledger normalization
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
// PRODUCTION SCHEMA (LOCKED)
// =====================================================

sqlite.serialize(() => {

  sqlite.run("PRAGMA foreign_keys = ON");

  // USERS
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      google_id TEXT UNIQUE,
      email TEXT UNIQUE NOT NULL,
      role TEXT DEFAULT 'user',
      subscription TEXT DEFAULT 'free',
      vip_level INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // USER CREDITS
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS user_credits (
      user_id TEXT PRIMARY KEY,
      credits INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // CREDIT LEDGER
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS credit_transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      amount INTEGER,
      type TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // PAYMENT LOG
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

  // OMISE EVENT LOCK
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS omise_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // FREE IP LIMIT
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS free_usage_ip (
      ip_address TEXT PRIMARY KEY,
      used_count INTEGER DEFAULT 0,
      last_used DATE
    )
  `);

  // JOBS
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      engine TEXT,
      alias TEXT,
      prompt TEXT,
      cost INTEGER,
      status TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

});

// =====================================================
// USER
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
// CREDIT SYSTEM (ATOMIC LEDGER)
// =====================================================

function getUserCredits(userId) {
  return new Promise((resolve, reject) => {
    sqlite.get(
      "SELECT credits FROM user_credits WHERE user_id = ?",
      [userId],
      (err, row) => {
        if (err) return reject(err);
        resolve(row ? row.credits : 0);
      }
    );
  });
}

function addCredit(userId, amount) {
  return new Promise((resolve, reject) => {

    sqlite.serialize(() => {

      sqlite.run("BEGIN TRANSACTION");

      sqlite.run(
        `INSERT OR IGNORE INTO user_credits (user_id, credits)
         VALUES (?, 0)`,
        [userId]
      );

      sqlite.run(
        `UPDATE user_credits
         SET credits = credits + ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?`,
        [amount, userId]
      );

      sqlite.run(
        `INSERT INTO credit_transactions
         (id, user_id, amount, type, description)
         VALUES (?, ?, ?, 'topup', 'Gateway Topup')`,
        [uuidv4(), userId, amount]
      );

      sqlite.run("COMMIT", err => {
        if (err) return reject(err);
        resolve(true);
      });

    });

  });
}

function deductCredit(userId, amount, engine) {
  return new Promise((resolve, reject) => {

    sqlite.serialize(() => {

      sqlite.get(
        "SELECT credits FROM user_credits WHERE user_id = ?",
        [userId],
        (err, row) => {

          if (err) return reject(err);
          if (!row || row.credits < amount)
            return reject(new Error("INSUFFICIENT_CREDIT"));

          sqlite.run("BEGIN TRANSACTION");

          sqlite.run(
            `UPDATE user_credits
             SET credits = credits - ?,
                 updated_at = CURRENT_TIMESTAMP
             WHERE user_id = ?`,
            [amount, userId]
          );

          sqlite.run(
            `INSERT INTO credit_transactions
             (id, user_id, amount, type, description)
             VALUES (?, ?, ?, 'usage', ?)`,
            [uuidv4(), userId, -amount, engine]
          );

          sqlite.run("COMMIT", err2 => {
            if (err2) return reject(err2);
            resolve(true);
          });

        }
      );

    });

  });
}

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  sqlite,
  getUserByEmail,
  createUser,
  getUserCredits,
  addCredit,
  deductCredit
};
