// =====================================================
// CREATE CONTROLLER — ULTRA CREDIT INTEGRATION
// =====================================================

const modelRouter = require("../models/model.router");
const creditEngine = require("../services/credit.engine");

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

      // ===============================
      // FREE CHECK
      // ===============================

      const freeAllowed =
      await creditEngine.checkFreeUsage(ip);

      if(!freeAllowed){

         const creditCheck =
         await creditEngine.checkAndUseCredit(
            user.id,
            alias
         );

         if(!creditCheck.allowed){

            return res.status(402).json({
               error:"Not enough credits"
            });

         }

      }

      // ===============================
      // FILE CHECK
      // ===============================

      if(alias !== "text_to_video" && !files.fileA){

         return res.status(400).json({
            error:"fileA missing"
         });

      }

      // ===============================
      // RUN MODEL
      // ===============================

      const result = await modelRouter.run({
         userId:user.id,
         engine,
         alias,
         type,
         prompt,
         files
      });

      res.json({
         status:"queued",
         result
      });

   }catch(err){

      console.error("CREATE ERROR:",err);

      res.status(500).json({
         error:err.message
      });

   }

};
