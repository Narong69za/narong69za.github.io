// routes/render.route.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const db = require("../db/db");
const modelRouter = require("../models/model.router");

// ======================
// DEV MODE CHECK
// ======================

const DEV_MODE = process.env.DEV_MODE === "true";

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

    console.log("===================================");
    console.log("RENDER REQUEST");
    console.log("ENGINE:", engine);
    console.log("MODE:", mode);
    console.log("DEV MODE:", DEV_MODE);
    console.log("===================================");

    // ======================
    // DEV SAFE MODE
    // ======================

    if (DEV_MODE) {

      console.log("⚡ DEV MODE ACTIVE - Runway BYPASSED");

      db.run(
        `
        INSERT INTO projects
        (id, engine, mode, prompt, status)
        VALUES (?, ?, ?, ?, ?)
        `,
        [id, engine, mode, prompt || "", "dev-mock"],
        (err) => {

          if (err) {
            console.error(err);
            return res.status(500).json({
              status: "error",
              message: err.message
            });
          }

          return res.json({
            status: "dev-success",
            id,
            message: "Runway bypassed (DEV MODE)"
          });

        }
      );

      return;
    }

    // ======================
    // PRODUCTION MODE
    // ======================

    const runwayResponse = await modelRouter.run({
      engine,
      mode,
      prompt
    });

    const externalID = runwayResponse?.id || runwayResponse?.taskId || null;

    db.run(
      `
      INSERT INTO projects
      (id, engine, mode, prompt, externalID, status)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [id, engine, mode, prompt || "", externalID, "processing"],
      (err) => {

        if (err) {
          console.error(err);
          return res.status(500).json({
            status: "error",
            message: err.message
          });
        }

        return res.json({
          status: "processing",
          id,
          externalID
        });

      }
    );

  } catch (err) {

    console.error("RENDER ERROR:", err.message);

    return res.status(500).json({
      status: "error",
      message: err.message
    });

  }

});

module.exports = router;
