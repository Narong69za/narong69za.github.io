const modelRouter = require("../models/model.router");

exports.create = async (req, res) => {

   try {

      const { engine, alias, type, prompt } = req.body;

      const user = req.user || { id: "DEV-BYPASS" };

      const files = {};

      if (req.files && Array.isArray(req.files)) {

         req.files.forEach(f => {
            files[f.fieldname] = f;
         });

      }

      console.log("FILES DEBUG:", Object.keys(files));

      // 🔥 ULTRA SAFE CHECK
      if (!files.fileA) {

         return res.status(400).json({
            error: "fileA missing",
            received: Object.keys(files)
         });

      }

      const result = await modelRouter.run({
         userId: user.id,
         engine,
         alias,
         type,
         prompt,
         files
      });

      res.json({
         status: "queued",
         result
      });

   } catch (err) {

      console.error("CREATE ERROR:", err);

      res.status(500).json({
         error: err.message || "CREATE FAILED"
      });

   }

};
