// =====================================================
// CREDIT SYSTEM (SCHEMA v9)
// =====================================================

function getUserCredits(userId) {
  return new Promise((resolve, reject) => {
    sqlite.get(
      "SELECT credits FROM user_credits WHERE user_id = ?",
      [userId],
      (err, row) => {
        if (err) return reject(err);
        resolve(row ? row.credits : 0);
      }
    );
  });
}

function addCredit(userId, amount) {
  return new Promise((resolve, reject) => {

    sqlite.serialize(() => {

      sqlite.run("BEGIN TRANSACTION");

      // ensure row exists
      sqlite.run(
        `INSERT OR IGNORE INTO user_credits (user_id, credits)
         VALUES (?, 0)`,
        [userId]
      );

      sqlite.run(
        `UPDATE user_credits
         SET credits = credits + ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?`,
        [amount, userId]
      );

      sqlite.run(
        `INSERT INTO credit_transactions
         (user_id, amount, type, description)
         VALUES (?, ?, 'topup', 'Payment Topup')`,
        [userId, amount]
      );

      sqlite.run("COMMIT", err => {
        if (err) return reject(err);
        resolve(true);
      });

    });

  });
}

function deductCredit(userId, amount, engine) {
  return new Promise((resolve, reject) => {

    sqlite.serialize(() => {

      sqlite.get(
        "SELECT credits FROM user_credits WHERE user_id = ?",
        [userId],
        (err, row) => {

          if (err) return reject(err);
          if (!row || row.credits < amount)
            return reject(new Error("INSUFFICIENT_CREDIT"));

          sqlite.run("BEGIN TRANSACTION");

          sqlite.run(
            `UPDATE user_credits
             SET credits = credits - ?,
                 updated_at = CURRENT_TIMESTAMP
             WHERE user_id = ?`,
            [amount, userId]
          );

          sqlite.run(
            `INSERT INTO credit_transactions
             (user_id, amount, type, description)
             VALUES (?, ?, 'usage', ?)`,
            [userId, -amount, engine]
          );

          sqlite.run("COMMIT", err2 => {
            if (err2) return reject(err2);
            resolve(true);
          });

        }
      );

    });

  });
}
