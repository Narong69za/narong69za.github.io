/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE : API ACTIVATE
 * VERSION: 1.2.0
 * STATUS : ACTIVE
 * PURPOSE: Activation Key API (Device bound, real DB)
 * LAST FIX: HWID API binding
 * =====================================================
 */

import express from "express";
const router = express.Router();
import db from "../db/db.js"; // DB connection module

// POST /api/activate
router.post("/activate", async (req, res) => {
  try {
    const { key, device_id } = req.body;

    if (!key) return res.json({ status: "error", message: "KEY_REQUIRED" });

    const result = await db.query("SELECT * FROM licenses WHERE license_key=?", [key]);

    if (!result.length) return res.json({ status: "invalid_key" });

    const license = result[0];
    const now = Date.now();
    const expire = new Date(license.expire_date).getTime();

    if (expire < now) return res.json({ status: "expired" });
    if (license.device_id && license.device_id !== device_id) return res.json({ status: "device_locked" });

    if (!license.device_id) await db.query("UPDATE licenses SET device_id=? WHERE license_key=?", [device_id, key]);

    return res.json({ status: "ok", plan: license.package, expire: license.expire_date });

  } catch (err) {
    console.error("ACTIVATE ERROR:", err);
    res.json({ status: "server_error" });
  }
});

export default router;
