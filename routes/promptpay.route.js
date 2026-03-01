// ======================================================
// PROJECT: SN DESIGN STUDIO
// MODULE: promptpay.route.js
// VERSION: 1.0.0
// STATUS: production
// LAST FIX: auto credit after slip verify
// ======================================================

const express = require("express");
const multer = require("multer");
const router = express.Router();

const db = require("../db/db");
const { verifySlip } = require("../services/slip-verify.service");
const authMiddleware = require("../middleware/auth");

const upload = multer({
  storage: multer.memoryStorage()
});

router.post(
  "/verify",
  authMiddleware,
  upload.single("slip"),
  async (req, res) => {

    try {

      if (!req.file) {
        return res.status(400).json({ error: "NO_SLIP" });
      }

      const result = await verifySlip(req.file.buffer);

      const receiver = result?.data?.receiver?.proxy?.value;
      const amount = parseFloat(result?.data?.amount);
      const ref = result?.data?.transRef;

      if (!receiver || receiver !== process.env.PROMPTPAY_ID) {
        return res.status(400).json({ error: "INVALID_RECEIVER" });
      }

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "INVALID_AMOUNT" });
      }

      // ป้องกันใช้สลิปซ้ำ
      const used = await db.checkSlipReference(ref);
      if (used) {
        return res.status(400).json({ error: "SLIP_ALREADY_USED" });
      }

      const credits = amount; // 1 บาท = 1 เครดิต (ปรับได้)

      await db.addCredit(req.user.id, credits);
      await db.saveSlipReference(ref);

      res.json({ success: true, credits });

    } catch (err) {

      console.error(err);
      res.status(500).json({ error: "VERIFY_FAILED" });

    }

  }
);

module.exports = router;
