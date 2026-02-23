// controllers/create.controller.js

const MODEL_ROUTER = require("../services/model.router");
const db = require("../db/db");

async function create(req,res){

   try{

      const engine = req.body.engine;
      const alias = req.body.alias;
      const type = req.body.type;
      const prompt = req.body.prompt || "";

      const files = {};

      if(req.files){

         req.files.forEach(f=>{
            files[f.fieldname] = f;
         });

      }

      if(!engine || !alias){

         return res.status(400).json({
            status:"error",
            message:"missing engine or alias"
         });

      }

      const id = Date.now().toString();

      // INSERT DB

      db.run(
         "INSERT INTO projects (id,engine,prompt,status) VALUES (?,?,?,?)",
         [id,engine,prompt,"processing"]
      );

      // RUN ENGINE REALTIME

      const result = await MODEL_ROUTER.run({
         engine,
         alias,
         type,
         prompt,
         files,
         jobID:id
      });

      res.json({
         status:"done",
         result
      });

   }catch(err){

      console.error(err);

      res.status(500).json({
         status:"error",
         message:err.message
      });

   }

}

module.exports = { create };
