// db/db.js

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
  path.join(__dirname, "database.sqlite")
);

db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      googleId TEXT UNIQUE,
      email TEXT,
      credit INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      engine TEXT,
      mode TEXT,
      prompt TEXT,
      fileAUrl TEXT,
      fileBUrl TEXT,
      externalID TEXT,
      outputUrl TEXT,
      status TEXT DEFAULT 'queued',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      amount INTEGER,
      type TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

});

function getUserByGoogleId(googleId){
  return new Promise((resolve,reject)=>{
    db.get(
      "SELECT * FROM users WHERE googleId=?",
      [googleId],
      (err,row)=> err?reject(err):resolve(row)
    );
  });
}

function createUser(data){
  return new Promise((resolve,reject)=>{
    db.run(
      "INSERT INTO users (googleId,email,credit) VALUES (?,?,?)",
      [data.googleId,data.email,3],
      function(err){
        err?reject(err):resolve(this.lastID);
      }
    );
  });
}

function updateCredit(userId,amount){
  return new Promise((resolve,reject)=>{
    db.run(
      "UPDATE users SET credit=credit+? WHERE id=?",
      [amount,userId],
      err=> err?reject(err):resolve()
    );
  });
}

function deductCredit(userId,amount){
  return new Promise((resolve,reject)=>{
    db.run(
      "UPDATE users SET credit=credit-? WHERE id=?",
      [amount,userId],
      err=> err?reject(err):resolve()
    );
  });
}

function createTransaction(userId,amount,type){
  return new Promise((resolve,reject)=>{
    db.run(
      "INSERT INTO transactions (userId,amount,type) VALUES (?,?,?)",
      [userId,amount,type],
      err=> err?reject(err):resolve()
    );
  });
}

module.exports = {
  getUserByGoogleId,
  createUser,
  updateCredit,
  deductCredit,
  createTransaction
};
