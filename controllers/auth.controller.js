const jwt = require("jsonwebtoken");
const db = require("../db/db");

exports.googleLogin = async (payload) => {

  if (!payload || !payload.sub) {
    throw new Error("Invalid Google payload");
  }

  return new Promise((resolve, reject) => {

    db.get(
      "SELECT * FROM users WHERE id = ?",
      [payload.sub],
      (err, row) => {

        if (err) {
          return reject(err);
        }

        if (row) {
          const token = jwt.sign(
            { id: row.id, email: row.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
          );

          return resolve({ token });
        }

        // ถ้าไม่มี user → สร้างใหม่
        db.run(
          "INSERT INTO users (id, email, name, credits) VALUES (?, ?, ?, ?)",
          [payload.sub, payload.email, payload.name, 0],
          function (err2) {

            if (err2) {
              return reject(err2);
            }

            const token = jwt.sign(
              { id: payload.sub, email: payload.email },
              process.env.JWT_SECRET,
              { expiresIn: "7d" }
            );

            return resolve({ token });
          }
        );

      }
    );

  });

};
