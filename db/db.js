const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
   path.join(__dirname,"ultra.db")
);

db.serialize(()=>{

/* ===============================
USERS TABLE
=============================== */

db.run(`
CREATE TABLE IF NOT EXISTS users(
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   googleID TEXT UNIQUE,
   email TEXT,
   name TEXT,
   credit REAL DEFAULT 0,
   createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);


/* ===============================
PROJECTS TABLE
=============================== */

db.run(`
CREATE TABLE IF NOT EXISTS projects(
   id TEXT PRIMARY KEY,
   userID INTEGER,
   templateID TEXT,
   engine TEXT,
   duration INTEGER,
   status TEXT,
   progress INTEGER,
   creditUsed REAL,
   eta TEXT,
   createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);


/* ===============================
PAYMENTS TABLE
=============================== */

db.run(`
CREATE TABLE IF NOT EXISTS payments(
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   externalID TEXT UNIQUE,
   userID INTEGER,
   amount REAL,
   status TEXT,
   createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

});

module.exports = db;
