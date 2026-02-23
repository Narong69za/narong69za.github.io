const db = require("../db/db");
const MODEL_ROUTER = require("./model.router");

async function processJobs(){

   db.all(
      "SELECT * FROM projects WHERE status='queued'",
      async (err,rows)=>{

         if(err) return;

         for(const job of rows){

            try{

               await MODEL_ROUTER.run({

                  engine: job.engine,
                  alias: job.alias,
                  type: job.type,
                  prompt: job.prompt,
                  files: job.files,
                  jobID: job.id

               });

               db.run(
                  "UPDATE projects SET status='done' WHERE id=?",
                  [job.id]
               );

            }catch(e){

               console.log("WORKER ERROR:",e);

               db.run(
                  "UPDATE projects SET status='failed' WHERE id=?",
                  [job.id]
               );

            }

         }

      }
   );

}

setInterval(processJobs,3000);

module.exports = {};
