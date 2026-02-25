require("dotenv").config();

const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const DB_PATH = process.env.DB_PATH || "./db/database.sqlite";

const sqlPath = path.join(__dirname, "init.sql");

const sql = fs.readFileSync(sqlPath, "utf8");

const db = new sqlite3.Database(DB_PATH);

console.log("INIT DB START...");

db.exec(sql, (err) => {

    if (err) {

        console.error("INIT ERROR:", err.message);
        process.exit(1);
    }

    console.log("DB INIT SUCCESS");

    db.close();
});
