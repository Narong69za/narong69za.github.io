// controllers/create.controller.js

const modelRouter = require("../services/model.router");
const db = require("../db/db");

/*
ULTRA AUTO ENGINE PIPELINE

REQ:
engine
alias
type
prompt
files(dynamic from schema)
*/

exports.create = async (req,res)=>{

   try{

      const { engine, alias, type, prompt } = req.body;

      if(!engine || !alias){

         return res.status(400).json({
            error:"ENGINE OR ALIAS MISSING"
         });

      }

      const id = Date.now().toString();

      /* =====================
         SAVE QUEUE ENTRY
      ====================== */

      db.run(
         "INSERT INTO projects (id,engine,alias,type,prompt,status) VALUES (?,?,?,?,?,?)",
         [
            id,
            engine,
            alias,
            type || "video",
            prompt || "",
            "queued"
         ]
      );

      /* =====================
         AUTO FILE DETECT
      ====================== */

      const files={};

      if(req.files){

         Object.keys(req.files).forEach(name=>{

            files[name]=req.files[name][0];

         });

      }

      /* =====================
         MODEL ROUTER CALL
      ====================== */

      const result = await modelRouter.run({

         engine,
         alias,
         type,
         prompt,
         files,
         jobID:id

      });

      /* =====================
         UPDATE STATUS
      ====================== */

      db.run(
         "UPDATE projects SET status=? WHERE id=?",
         ["processing",id]
      );

      res.json({

         status:"processing",
         id,
         result

      });

   }catch(err){

      console.log("CREATE CONTROLLER ERROR",err);

      res.status(500).json({

         error:"PIPELINE FAILED"

      });

   }

};
