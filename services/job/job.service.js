const db = require("../../db/db");

async function createJob({ userId, engine, model, taskId }) {

   return await db.jobs.create({
      user_id: userId,
      engine,
      model,
      task_id: taskId,
      status: "processing"
   });

}

async function updateJob(jobId, data) {

   return await db.jobs.update(data, {
      where: { id: jobId }
   });

}

async function getPendingJobs() {

   return await db.jobs.findAll({
      where: { status: "processing" }
   });

}

module.exports = {
   createJob,
   updateJob,
   getPendingJobs
};
