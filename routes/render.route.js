// routes/render.route.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const db = require("../db/db");
const modelRouter = require("../models/model.router");

// ======================
// MULTER CONFIG
// ======================

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 500 // 500MB
  }
});

const uploadAny = upload.any();

// ======================
// RENDER ROUTE
// ======================

router.post("/render", uploadAny, async (req, res) => {

  try {

    const { engine, mode, prompt } = req.body;

    if (!engine || !mode) {
      return res.status(400).json({
        status: "error",
        message: "Missing engine or mode"
      });
    }

    const id = Date.now().toString();

    console.log("ENGINE:", engine);
    console.log("MODE:", mode);
    console.log("FILES:", req.files?.map(f => f.fieldname));

    // ======================
    // HANDLE FILE INPUT
    // ======================

    let imageUrl = null;
    let videoUri = null;

    if (req.files && req.files.length > 0) {

      const file = req.files[0];

      // ⚠ IMPORTANT:
      // ตอนนี้ยังไม่มีระบบ upload ไป S3
      // ดังนั้นถ้าเป็น production จริง ต้องอัปโหลดก่อนแล้วค่อยส่ง URL

      imageUrl = file.originalname;
      videoUri = file.originalname;

    }

    // ======================
    // CALL MODEL ROUTER
    // ======================

    const runwayResponse = await modelRouter.run({
      engine,
      mode,
      prompt,
      imageUrl,
      videoUri
    });

    const externalID = runwayResponse.id || runwayResponse.taskId;

    // ======================
    // INSERT PROJECT
    // ======================

    db.run(
      `
      INSERT INTO projects
      (id, engine, mode, prompt, externalID, status)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        id,
        engine,
        mode,
        prompt || "",
        externalID || null,
        "processing"
      ],
      (err) => {

        if (err) {

          console.error(err);

          return res.status(500).json({
            status: "error",
            message: err.message
          });

        }

        res.json({
          status: "processing",
          id,
          externalID
        });

      }
    );

  } catch (err) {

    console.error("RENDER ERROR:", err.message);

    res.status(500).json({
      status: "error",
      message: err.message
    });

  }

});

module.exports = router;
