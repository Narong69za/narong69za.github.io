const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
   path.join(__dirname,"ultra.db")
);

db.serialize(()=>{

   db.run(`
      CREATE TABLE IF NOT EXISTS projects(
         id TEXT PRIMARY KEY,
         templateID TEXT,
         engine TEXT,
         duration INTEGER,
         status TEXT,
         progress INTEGER,
         creditUsed REAL,
         eta TEXT,
         createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
   `);

});

module.exports = db;
