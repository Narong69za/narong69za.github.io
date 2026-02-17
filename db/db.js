const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./snstudio.db");

db.serialize(()=>{

   db.run(`
      CREATE TABLE IF NOT EXISTS jobs (
         id TEXT PRIMARY KEY,
         templateID TEXT,
         engine TEXT,
         duration INTEGER,
         status TEXT,
         progress INTEGER,
         createdAt INTEGER
      )
   `);

});

module.exports = db;
