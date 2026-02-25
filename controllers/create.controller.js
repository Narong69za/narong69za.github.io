// controllers/create.controller.js
// =====================================================
// SN DESIGN ENGINE AI
// CREATE CONTROLLER — FULL VERSION
// ULTRA SAFE CHECK (ALLOW text_to_video WITHOUT fileA)
// ADD-ONLY / SAFE FLOW
// =====================================================

const creditEngine = require("../services/credit.engine");
const modelRouter = require("../models/model.router");

exports.create = async (req, res) => {

   try {

      // ===============================
      // BODY
      // ===============================
      const { engine, alias, type, prompt } = req.body;

      // DEV SAFE USER
      const user = req.user || { id: "DEV-BYPASS" };

      // ===============================
      // FILE PARSER
      // ===============================
      const files = {};

      if (req.files && Array.isArray(req.files)) {

         req.files.forEach(f => {
            files[f.fieldname] = f;
         });

      }

      console.log("FILES DEBUG:", Object.keys(files));
      console.log("ALIAS:", alias);
      console.log("PROMPT:", prompt);

      // =====================================================
      // 🔥 CREDIT CHECK ULTRA (ต้องอยู่ตรงนี้)
      // =====================================================

      const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress;

      const freeAllowed =
      await creditEngine.checkFreeUsage(ip);

      if (!freeAllowed) {

         const creditCheck =
         await creditEngine.checkAndUseCredit(
            user.id,
            alias
         );

         if (!creditCheck.allowed) {

            return res.status(402).json({
               error: "Not enough credits"
            });

         }
      }

      // =====================================================
      // 🔥 ULTRA SAFE CHECK
      // REQUIRE fileA ONLY when NOT text_to_video
      // =====================================================

      if (alias !== "text_to_video" && !files.fileA) {

         return res.status(400).json({
            error: "fileA missing",
            alias: alias,
            received: Object.keys(files)
         });

      }

      // =====================================================
      // MODEL ROUTER
      // =====================================================

      const result = await modelRouter.run({
         userId: user.id,
         engine,
         payload: {
            type,
            prompt,
            files
         }
      });

      // =====================================================
      // RESPONSE
      // =====================================================

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
