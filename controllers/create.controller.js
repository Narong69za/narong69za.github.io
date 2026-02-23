const MODEL_ROUTER = require("../services/model.router");
const db = require("../db/db");

async function create(req,res){

   try{

      const engine = req.body.engine;
      const alias = req.body.alias;
      const type = req.body.type;
      const prompt = req.body.prompt || "";

      if(!engine || !alias){

         return res.status(400).json({
            error:"missing engine or alias"
         });

      }

      const jobID = Date.now().toString();

      db.run(
         "INSERT INTO projects (id,engine,prompt,status) VALUES (?,?,?,?)",
         [jobID,engine,prompt,"queued"]
      );

      const result = await MODEL_ROUTER.run({

         engine,
         alias,
         type,
         prompt,
         files:req.files || [],
         jobID

      });

      res.json({

         status:"done",
         jobID,
         result

      });

   }catch(err){

      console.log(err);

      res.status(500).json({
         status:"error",
         error:err.message
      });

   }

}

module.exports = { create };
