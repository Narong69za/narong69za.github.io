// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: services/usage-check.js
// VERSION: v2.0.0
// STATUS: production
// LAST FIX: add credit deduction + atomic protection + free fallback
// =====================================================

const db = require("../db/db");

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
    // AUTH USER (JWT REQUIRED)
    // ======================

    const user = req.user;

    if (user?.id) {

      const userData = await db.getUser(user.id);

      if (!userData) {
        return res.status(404).json({ error: "USER NOT FOUND" });
      }

      // ======================
      // CREDIT MODE
      // ======================

      if (userData.credits > 0) {

        const result = await db.decreaseCreditAtomic(user.id, 1);

        if (!result) {
          return res.status(402).json({ error: "NO CREDIT" });
        }

        console.log("CREDIT USED → Remaining:", userData.credits - 1);

        return next();
      }

    }

    // ======================
    // FREE IP FALLBACK MODE
    // ======================

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress;

    const today = new Date().toISOString().slice(0, 10);

    global.usageStore = global.usageStore || {};

    const key = ip + "_" + today;

    if (!global.usageStore[key]) {
      global.usageStore[key] = 0;
    }

    if (global.usageStore[key] >= 3) {
      return res.status(403).json({
        limit: true,
        message: "FREE LIMIT REACHED"
      });
    }

    global.usageStore[key]++;

    console.log("FREE COUNT:", global.usageStore[key]);

    next();

  } catch (err) {

    console.log("USAGE CHECK ERROR:", err);

    res.status(500).json({ error: "USAGE_CHECK_FAILED" });

  }

};
