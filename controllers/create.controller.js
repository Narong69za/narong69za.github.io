const MODEL_ROUTER = require("../models/model.router");
const db = require("../db/db");

exports.create = async (req, res) => {

   try {

      const engine = req.body.engine;
      const alias = req.body.alias;
      const type = req.body.type || "video";
      const prompt = req.body.prompt || "";

      const files = req.files || {};

      if (!engine || !alias) {
         return res.status(400).json({ error: "missing engine or alias" });
      }

      console.log("CREATE JOB:", engine, alias);

      // create project record
      const jobID = Date.now().toString();

      db.run(
         "INSERT INTO projects (id,status,engine,alias) VALUES (?,?,?,?)",
         [jobID, "queued", engine, alias]
      );

      // RUN MODEL
      const result = await MODEL_ROUTER.run({
         engine,
         alias,
         type,
         prompt,
         files,
         jobID
      });

      return res.json({
         status: "started",
         jobID,
         result
      });

   } catch (err) {

      console.error("CREATE ERROR:", err);

      return res.status(500).json({
         error: err.message
      });
   }
};
