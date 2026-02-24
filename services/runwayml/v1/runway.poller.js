// services/runwayml/v1/runway.poller.js

const fetch = require("node-fetch");
const db = require("../../../db/db");

const STATUS_ENDPOINT = "https://api.dev.runwayml.com/v1/tasks/";

async function checkTask(id) {

  const res = await fetch(`${STATUS_ENDPOINT}${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.RUNWAY_API_KEY}`,
      "X-Runway-Version": "2024-11-06"
    }
  });

  return await res.json();
}

async function poll() {

  const jobs = await db.getProcessingRunwayJobs();

  for (const job of jobs) {

    try {

      const result = await checkTask(job.externalID);

      if (result.status === "SUCCEEDED") {

        await db.completeJob(
          job.id,
          result.output?.videoUri || null
        );

      }

      if (result.status === "FAILED") {
        await db.failJob(job.id);
      }

    } catch (err) {
      console.error(err.message);
    }

  }

}

function start() {
  setInterval(poll, 8000);
}

module.exports = { start };
