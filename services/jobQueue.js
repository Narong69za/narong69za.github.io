/* ======================================
ULTRA ENGINE JOB QUEUE
====================================== */

const jobs = {};

function createJob(){

   const id = Date.now().toString();

   jobs[id] = {
      id,
      status:"queued",
      progress:0
   };

   return jobs[id];
}

function updateJob(id,data){

   if(!jobs[id]) return;

   jobs[id] = {
      ...jobs[id],
      ...data
   };
}

function getJob(id){
   return jobs[id];
}

module.exports = {
   createJob,
   updateJob,
   getJob
};
