const sqlite3 = require("sqlite3").verbose();

const DB_PATH = process.env.DB_PATH || "./db/database.sqlite";
const db = new sqlite3.Database(DB_PATH);

// ==============================
// GET ALL USERS
// ==============================
exports.getUsers = (req, res) => {
  db.all(
    `SELECT u.id, u.email, u.role, u.subscription, u.vip_level,
            IFNULL(c.credits,0) as credits,
            u.created_at
     FROM users u
     LEFT JOIN user_credits c ON u.id = c.user_id
     ORDER BY u.created_at DESC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};

// ==============================
// ADD CREDIT
// ==============================
exports.addCredit = (req, res) => {
  const { user_id, amount } = req.body;

  if (!user_id || !amount)
    return res.status(400).json({ error: "Missing fields" });

  db.run(
    `UPDATE user_credits
     SET credits = credits + ?
     WHERE user_id = ?`,
    [amount, user_id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      db.run(
        `INSERT INTO credit_transactions (user_id, amount, type, description)
         VALUES (?, ?, 'add', 'Admin add credit')`,
        [user_id, amount]
      );

      res.json({ success: true });
    }
  );
};

// ==============================
// REMOVE CREDIT
// ==============================
exports.removeCredit = (req, res) => {
  const { user_id, amount } = req.body;

  if (!user_id || !amount)
    return res.status(400).json({ error: "Missing fields" });

  db.run(
    `UPDATE user_credits
     SET credits = credits - ?
     WHERE user_id = ?`,
    [amount, user_id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      db.run(
        `INSERT INTO credit_transactions (user_id, amount, type, description)
         VALUES (?, ?, 'use', 'Admin remove credit')`,
        [user_id, amount]
      );

      res.json({ success: true });
    }
  );
};

// ==============================
// OVERVIEW DASHBOARD
// ==============================
exports.getOverview = (req, res) => {
  const data = {};

  db.get(`SELECT COUNT(*) as total_users FROM users`, [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    data.total_users = row.total_users;

    db.get(
      `SELECT SUM(credits) as total_credits FROM user_credits`,
      [],
      (err2, row2) => {
        if (err2)
          return res.status(500).json({ error: err2.message });

        data.total_credits = row2.total_credits || 0;

        db.get(
          `SELECT COUNT(*) as total_jobs FROM jobs`,
          [],
          (err3, row3) => {
            if (err3)
              return res.status(500).json({ error: err3.message });

            data.total_jobs = row3.total_jobs;

            res.json(data);
          }
        );
      }
    );
  });
};
