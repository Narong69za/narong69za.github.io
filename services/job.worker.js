const db = require("../db/db");
const MODEL_ROUTER = require("./model.router");

const sleep = (ms)=> new Promise(r=>setTimeout(r,ms));

async function pollReplicate(predictionId){

    const fetch = require("node-fetch");

    const res = await fetch(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
            headers:{
                "Authorization":`Bearer ${process.env.REPLICATE_API_TOKEN}`
            }
        }
    );

    return await res.json();
}

exports.run = async(job)=>{

    try{

        db.run(`UPDATE projects SET status='processing' WHERE id=?`,[job.id]);

        const prediction = await MODEL_ROUTER.run(job);

        let result = prediction;

        while(true){

            result = await pollReplicate(prediction.id);

            console.log("REPLICATE STATUS:",result.status);

            db.run(
                `UPDATE projects SET status=? WHERE id=?`,
                [result.status,job.id]
            );

            if(result.status==="succeeded"){

                const output = Array.isArray(result.output)
                    ? result.output[0]
                    : result.output;

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
