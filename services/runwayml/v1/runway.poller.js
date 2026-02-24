// services/runwayml/v1/runway.poller.js

const fetch = require("node-fetch");
const db = require("../../db/db");

const STATUS_API = "https://api.dev.runwayml.com/v1/tasks/";

async function checkTask(taskID){

    const res = await fetch(`${STATUS_API}${taskID}`, {

        method: "GET",

        headers: {
            "Authorization": `Bearer ${process.env.RUNWAY_API_KEY}`,
            "X-Runway-Version": "2024-11-06"
        }

    });

    const data = await res.json();

    return data;

}


async function poll(){

    const jobs = await db.getProcessingRunwayJobs();

    for(const job of jobs){

        try{

            const result = await checkTask(job.externalID);

            if(result.status === "SUCCEEDED"){

                await db.completeJob({

                    id: job.id,
                    output: result.output?.videoUri || null

                });

            }

            if(result.status === "FAILED"){

                await db.failJob(job.id);

            }

        }catch(err){

            console.error("RUNWAY POLL ERROR:", err.message);

        }

    }

}

function start(){

    setInterval(poll, 8000);

}

module.exports = { start };
