// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: services/usage-check.js
// VERSION: v9.0.0
// STATUS: production-final
// LAYER: backend
// RESPONSIBILITY:
// - enforce engine credit cost
// - atomic deduction
// DEPENDS ON:
// - config/credit.policy.js
// - db/db.js
// LAST FIX:
// - unified v9 header standard
// =====================================================

const db = require("../db/db");
const CREDIT_POLICY = require("../config/credit.policy");

module.exports = async function usageCheck(req, res, next) {

  try {

    // ======================
    // DEV MODE BYPASS
    // ======================

    if (process.env.DEV_MODE === "true") {
      console.log("DEV BYPASS ACTIVE");
      return next();
    }

    // ======================
    // REQUIRE AUTH USER
    // ======================

    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    // ======================
    // FETCH USER
    // ======================

    const userData = await new Promise((resolve, reject) => {
      db.sqlite.get(
        "SELECT * FROM users WHERE id = ?",
        [user.id],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });

    if (!userData) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    // ======================
    // ENGINE COST LOOKUP
    // ======================

    const engine = req.body?.engine;

    if (!engine) {
      return res.status(400).json({ error: "ENGINE_REQUIRED" });
    }

    const cost = CREDIT_POLICY.ENGINE_COST[engine];

    if (!cost) {
      return res.status(400).json({ error: "INVALID_ENGINE" });
    }

    // ======================
    // CHECK CREDIT
    // ======================

    if (userData.credits < cost) {
      return res.status(402).json({ error: "INSUFFICIENT_CREDIT" });
    }

    // ======================
    // ATOMIC DEDUCTION
    // ======================

    await db.deductCredit(user.id, cost, engine);

    console.log(
      `CREDIT USED → user:${user.id} engine:${engine} cost:${cost}`
    );

    next();

  } catch (err) {

    console.log("USAGE CHECK ERROR:", err);

    res.status(500).json({ error: "USAGE_CHECK_FAILED" });

  }

};
