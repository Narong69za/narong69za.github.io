const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.sqlite");

/*
ULTRA FINAL SCHEMA
*/

db.serialize(()=>{

   db.run(`
      CREATE TABLE IF NOT EXISTS projects (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         engine TEXT,
         alias TEXT,
         type TEXT,
         prompt TEXT,
         status TEXT,
         created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
   `);

});

module.exports = db;
