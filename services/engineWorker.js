/* ======================================
ULTRA REAL ENGINE WORKER
====================================== */

const { updateJob } = require("./jobQueue");

async function startRender(jobID){

   updateJob(jobID,{
      status:"processing",
      progress:0
   });

   let progress = 0;

   const interval = setInterval(()=>{

      progress += 5;

      updateJob(jobID,{
         progress
      });

      if(progress >= 100){

         updateJob(jobID,{
            status:"complete",
            progress:100
         });

         clearInterval(interval);

      }

   },1000);

}

module.exports = {
   startRender
};
