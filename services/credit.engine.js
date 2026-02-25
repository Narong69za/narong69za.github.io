const sqlite3 = require("sqlite3").verbose();
const { v4: uuidv4 } = require("uuid");

const DB_PATH = process.env.DB_PATH || "./db/database.sqlite";
const db = new sqlite3.Database(DB_PATH);

const MODEL_COST = {
   text_to_video: 20,
   image_to_video: 30,
   text_to_image: 5
};

function getCost(alias) {
   return MODEL_COST[alias] || 10;
}

async function checkFreeUsage(ip) {
   return new Promise((resolve, reject) => {

      const today = new Date().toISOString().slice(0, 10);

      db.get("SELECT * FROM free_usage_ip WHERE ip_address = ?", [ip], (err, row) => {

         if (err) return reject(err);

         if (!row) {
            db.run(
               "INSERT INTO free_usage_ip (ip_address, used_count, last_used) VALUES (?,1,?)",
               [ip, today]
            );
            return resolve(true);
         }

         if (row.last_used !== today) {
            db.run(
               "UPDATE free_usage_ip SET used_count=1, last_used=? WHERE ip_address=?",
               [today, ip]
            );
            return resolve(true);
         }

         if (row.used_count < 3) {
            db.run(
               "UPDATE free_usage_ip SET used_count=used_count+1 WHERE ip_address=?",
               [ip]
            );
            return resolve(true);
         }

         return resolve(false);
      });
   });
}

async function checkAndUseCredit(userId, alias) {

   const cost = getCost(alias);

   return new Promise((resolve, reject) => {

      db.get("SELECT credits FROM user_credits WHERE user_id = ?", [userId], (err, row) => {

         if (err) return reject(err);

         if (!row || row.credits < cost)
            return resolve({ allowed: false, cost });

         db.run(
            "UPDATE user_credits SET credits = credits - ? WHERE user_id = ?",
            [cost, userId]
         );

         db.run(
            "INSERT INTO credit_transactions (user_id, amount, type, description) VALUES (?,?,?,?)",
            [userId, cost, "use", alias]
         );

         resolve({ allowed: true, cost });
      });
   });
}

async function addCredit(userId, amount) {

   return new Promise((resolve, reject) => {

      db.get("SELECT * FROM user_credits WHERE user_id = ?", [userId], (err, row) => {

         if (!row) {
            db.run(
               "INSERT INTO user_credits (user_id, credits) VALUES (?,?)",
               [userId, amount]
            );
         } else {
            db.run(
               "UPDATE user_credits SET credits = credits + ? WHERE user_id = ?",
               [amount, userId]
            );
         }

         db.run(
            "INSERT INTO credit_transactions (user_id, amount, type, description) VALUES (?,?,?,?)",
            [userId, amount, "add", "stripe topup"]
         );

         resolve(true);
      });
   });
}

module.exports = {
   checkFreeUsage,
   checkAndUseCredit,
   addCredit,
   getCost
};
