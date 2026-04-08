/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE : API ACTIVATE
 * VERSION: 2.0.0 (PRODUCTION FIXED)
 * =====================================================
 */

import express from "express";
const router = express.Router();
import db from "../db/db.js";

// =============================================
// POST /api/activate
// =============================================
router.post("/activate", async (req, res) => {

  try {

    const { key, device_id } = req.body;

    // =============================
    // VALIDATE INPUT
    // =============================
    if (!key) {
      return res.json({ status: "error", message: "KEY_REQUIRED" });
    }

    if (!device_id) {
      return res.json({ status: "error", message: "DEVICE_REQUIRED" });
    }

    // =============================
    // FIND LICENSE
    // =============================
    const [rows] = await db.query(
      "SELECT * FROM licenses WHERE license_key=? LIMIT 1",
      [key]
    );

    if (!rows.length) {
      return res.json({ status: "invalid_key" });
    }

    const license = rows[0];

    // =============================
    // EXPIRE CHECK
    // =============================
    const now = Date.now();
    const expire = new Date(license.expire_date).getTime();

    if (expire < now) {
      return res.json({ status: "expired" });
    }

    // =============================
    // DEVICE LOCK CHECK
    // =============================
    if (license.device_id && license.device_id !== device_id) {
      return res.json({ status: "device_locked" });
    }

    // =============================
    // BIND DEVICE (FIRST TIME)
    // =============================
    if (!license.device_id) {

      await db.query(
        "UPDATE licenses SET device_id=? WHERE license_key=?",
        [device_id, key]
      );

    }

    // =============================
    // SUCCESS
    // =============================
    return res.json({
      status: "ok",
      plan: license.package,
      expire: license.expire_date
    });

  } catch (err) {

    console.error("ACTIVATE ERROR:", err);

    return res.status(500).json({
      status: "server_error"
    });

  }

});

export default router;
