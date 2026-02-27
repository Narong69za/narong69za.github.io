const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// ==============================
// DATABASE INIT
// ==============================

const dbPath = path.join(__dirname, "database.sqlite");

const sqlite = new sqlite3.Database(dbPath);

// ==============================
// CREATE TABLE IF NOT EXISTS
// ==============================

sqlite.serialize(() => {
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      googleId TEXT UNIQUE,
      email TEXT,
      credits INTEGER DEFAULT 0
    )
  `);
});

// ==============================
// GET USER BY GOOGLE ID
// ==============================

function getUserByGoogleId(googleId) {
  return new Promise((resolve, reject) => {
    sqlite.get(
      "SELECT * FROM users WHERE googleId = ?",
      [googleId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
}

// ==============================
// CREATE USER
// ==============================

function createUser({ googleId, email }) {
  return new Promise((resolve,
