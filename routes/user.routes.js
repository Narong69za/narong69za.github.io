// =====================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: routes/user.routes.js
// VERSION: v9.1.0
// STATUS: production-final
// LAYER: user
// RESPONSIBILITY:
// - return authenticated user profile
// DEPENDS ON:
// - middleware/auth.js
// - db/db.js
// LAST FIX:
// - removed x-user-id header usage
// - unified with JWT auth
// =====================================================

const express = require("express");
const router = express.Router();
const db = require("../db/db");

// =====================================================
// GET CURRENT USER
// =====================================================

router.get("/me", async (req, res) => {

  try {

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    const user = await new Promise((resolve, reject) => {
      db.sqlite.get(
        "SELECT id,email,role,credits FROM users WHERE id = ?",
        [userId],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });

    if (!user) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    return res.json(user);

  } catch (err) {

    console.error("USER ROUTE ERROR:", err);
    return res.status(500).json({ error: "USER_FETCH_FAILED" });

  }

});

module.exports = router;
