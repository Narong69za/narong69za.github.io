const { getPendingJobs, updateJob } = require("./job.service");
const { getRunwayStatus } = require("../runwayml/v1/status");

async function pollJobs() {

   const jobs = await getPendingJobs();

   for (const job of jobs) {

      try {

         const statusData = await getRunwayStatus(job.task_id);

         if (statusData.status === "SUCCEEDED") {

            const outputUrl = statusData.output?.[0]?.url || null;

            await updateJob(job.id, {
               status: "completed",
               output_url: outputUrl
            });

         }

         if (statusData.status === "FAILED") {

            await updateJob(job.id, {
               status: "failed"
            });

         }

      } catch (err) {

         console.error("JOB POLL ERROR:", err.message);

      }

   }

}

function startPoller() {

   setInterval(() => {
      pollJobs();
   }, 5000); // 5 วินาที

}

module.exports = {
   startPoller
};
