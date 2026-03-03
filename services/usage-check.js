// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: services/usage-check.js
// VERSION: v9.1.0
// STATUS: production-final
// LAYER: backend
// RESPONSIBILITY:
// - enforce engine credit cost
// - atomic ledger deduction
// - block insufficient credit
// DEPENDS ON:
// - config/credit.policy.js
// - db/db.js
// LAST FIX:
// - switched to user_credits table
// - removed legacy users.credits
// =====================================================

const db = require("../db/db");
const CREDIT_POLICY = require("../config/credit.policy");

module.exports = async function usageCheck(req, res, next) {

  try {

    // ======================
    // DEV MODE BYPASS
    // ======================

    if (process.env.DEV_MODE === "true") {
      return next();
    }

    // ======================
    // AUTH REQUIRED
    // ======================

    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    // ======================
    // ENGINE REQUIRED
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
    // FETCH CREDIT (NEW SCHEMA)
    // ======================

    const credits = await db.getUserCredits(user.id);

    if (credits < cost) {
      return res.status(402).json({ error: "INSUFFICIENT_CREDIT" });
    }

    // ======================
    // ATOMIC DEDUCT
    // ======================

    await db.deductCredit(user.id, cost, engine);

    console.log(
      `CREDIT USED → user:${user.id} engine:${engine} cost:${cost}`
    );

    next();

  } catch (err) {

    console.error("USAGE CHECK ERROR:", err);

    res.status(500).json({ error: "USAGE_CHECK_FAILED" });

  }

};
