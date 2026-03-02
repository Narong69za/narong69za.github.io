// =====================================================
// PROJECT: SN DESIGN ENGINE AI
// MODULE: controllers/create.controller.js
// VERSION: 2.1.0
// STATUS: production
// LAST FIX: ADD ENGINE LOCK LAYER (no structure modification)
// =====================================================

// =====================================================
// CREATE CONTROLLER — ULTRA CREDIT INTEGRATION
// =====================================================
const { v4: uuidv4 } = require("uuid");
const db = require("../db/db");
const modelRouter = require("../models/model.router");
const creditEngine = require("../services/credit.engine");

// 🔥 NEW: ENGINE LOCK MAP (ADD-ONLY)
const { getEngine } = require("../services/engine.map");

exports.create = async (req,res)=>{

   try{

      const { engine, alias, type, prompt } = req.body;

      const user = req.user || { id:"DEV-BYPASS" };

      const files = {};

      if(req.files && Array.isArray(req.files)){
         req.files.forEach(f=>{
            files[f.fieldname] = f;
         });
      }

      const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress;

      // ==================================================
      // 🔒 ENGINE LOCK VALIDATION (NEW SAFE LAYER)
      // ==================================================

      let lockedEngineConfig = null;

      try{
         lockedEngineConfig = getEngine(alias);
      }catch(e){
         return res.status(400).json({
            error:"ENGINE_NOT_ALLOWED"
         });
      }

      // ==================================================
      // FREE CHECK (UNCHANGED)
      // ==================================================

      const freeAllowed =
      await creditEngine.checkFreeUsage(ip);

      if(!freeAllowed){

         // 🔥 override cost from engine map if exists
         const creditCheck =
         await creditEngine.checkAndUseCredit(
            user.id,
            alias,
            lockedEngineConfig.cost // ADD-ONLY param
         );

         if(!creditCheck.allowed){

            return res.status(402).json({
               error:"Not enough credits"
            });

         }

      }

      // ==================================================
      // FILE CHECK (UNCHANGED)
      // ==================================================

      if(alias !== "text_to_video" && !files.fileA){

         return res.status(400).json({
            error:"fileA missing"
         });

      }

      // ==================================================
      // RUN MODEL (ENGINE LOCK ENFORCED)
      // ==================================================

      const result = await modelRouter.run({
         userId:user.id,
         engine:lockedEngineConfig.provider,  // LOCKED
         alias,                                // UI key
         modelId:lockedEngineConfig.modelId,   // 🔥 deterministic
         type,
         prompt,
         files
      });

      res.json({
         status:"queued",
         engineVersion:lockedEngineConfig.version, // observability
         result
      });

   }catch(err){

      console.error("CREATE ERROR:",err);

      res.status(500).json({
         error:err.message
      });

   }

};
