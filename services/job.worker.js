const db = require("../db/db");
const MODEL_ROUTER = require("./model.router");

async function processJobs(){

   db.all(
      "SELECT * FROM projects WHERE status='queued'",
      async (err,rows)=>{

         if(err) return;

         for(const job of rows){

            try{

               await MODEL_ROUTER.run(
                  job.alias,
                  job.engine,
                  {
                     prompt:job.prompt
                  }
               );

               db.run(
                  "UPDATE projects SET status='done' WHERE id=?",
                  [job.id]
               );

            }catch(e){

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
