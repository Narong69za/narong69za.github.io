const db = require("../db/db");
const MODEL_ROUTER = require("./model.router");
const fetch = require("node-fetch");

const sleep = (ms)=> new Promise(r=>setTimeout(r,ms));

/* ============================
   ENGINE POLLERS
============================ */

async function pollReplicate(predictionId){

    const res = await fetch(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
            headers:{
                Authorization:`Bearer ${process.env.REPLICATE_API_TOKEN}`
            }
        }
    );

    return await res.json();
}

async function pollRunway(taskId){

    const res = await fetch(
        `https://api.runwayml.com/v1/tasks/${taskId}`,
        {
            headers:{
                Authorization:`Bearer ${process.env.RUNWAY_API_KEY}`
            }
        }
    );

    return await res.json();
}

/* ============================
   MAIN WORKER
============================ */

exports.run = async(job)=>{

    try{

        db.run(`UPDATE projects SET status='processing' WHERE id=?`,[job.id]);

        const resultStart = await MODEL_ROUTER.run(job);

        let engine = resultStart.engine; // IMPORTANT
        let result = resultStart;

        while(true){

            if(engine==="replicate"){

                result = await pollReplicate(resultStart.id);

            }else if(engine==="runway"){

                result = await pollRunway(resultStart.id);

            }

            console.log("ENGINE STATUS:",engine,result.status);

            db.run(
                `UPDATE projects SET status=? WHERE id=?`,
                [result.status,job.id]
            );

            if(result.status==="succeeded" || result.status==="completed"){

                const output = result.output || result.assets?.[0]?.url;

                db.run(
                    `UPDATE projects SET status='done', output=? WHERE id=?`,
                    [output,job.id]
                );

                break;
            }

            if(result.status==="failed"){

                db.run(
                    `UPDATE projects SET status='failed' WHERE id=?`,
                    [job.id]
                );

                break;
            }

            await sleep(3000);

        }

    }catch(err){

        console.error("WORKER ERROR:",err);

        db.run(
            `UPDATE projects SET status='error' WHERE id=?`,
            [job.id]
        );

    }

};
