/**
 * PROJECT: SN DESIGN STUDIO
 * MODULE: middleware/checkCredit.js
 * VERSION: v2.0.0
 * STATUS: production
 * LAST FIX: switch from x-user-id header to session-based user detection
 */

const db = require("../db/db.js");

module.exports = async (req, res, next) => {

  try {

    // 🔥 ใช้ user จาก session หรือ auth middleware ที่มีอยู่
    const userId = req.user?.id || req.session?.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "UNAUTHORIZED_USER" });
    }

    const user = await db.getUser(userId);

    if (!user) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    if (user.credits <= 0) {
      return res.status(402).json({ error: "NO_CREDIT" });
    }

    // ensure req.user is always defined downstream
    req.user = user;

    next();

  } catch (err) {
    console.error("CREDIT CHECK ERROR:", err);
    res.status(500).json({ error: "CREDIT_CHECK_FAILED" });
  }

};
