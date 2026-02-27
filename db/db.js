/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: db/db.js
 * VERSION: v2.0.0
 * STATUS: production
 * LAST FIX: migrate to production schema + env db path
 */

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = process.env.DB_PATH || path.join(__dirname, "database.sqlite");

console.log("DB PATH:", dbPath);

const sqlite = new sqlite3.Database(dbPath);

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
module.exports = {
  sqlite,
  getUserByGoogleId,
  getUserByEmail,
  createUser
};
