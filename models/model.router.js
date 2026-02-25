// models/model.router.js

const runway = require("../services/runwayml/v1");

async function run({

    userId,
    engine,
    alias,
    type,
    prompt,
    files

}){

    /* ===============================
       RUNWAY ENGINE
    =============================== */

    if(engine === "runwayml"){

        switch(alias){

            /* ======================
               TEXT TO VIDEO (NEW)
            ====================== */

            case "text_to_video":

                return await runway.run({
                    mode:"text_to_video",
                    payload:{
                        prompt: prompt
                    }
                });

            /* ======================
               IMAGE TO VIDEO
            ====================== */

            case "image_to_video":

                return await runway.run({
                    mode:"image2video",
                    payload:{
                        file: files.fileA
                    }
                });

            case "motion":
            case "dance":
            case "lipsync":

                return await runway.run({
                    mode:alias,
                    payload:{
                        file: files.fileA
                    }
                });

            case "upscale":

                return await runway.run({
                    mode:"upscale",
                    payload:{
                        file: files.fileA
                    }
                });

            default:

                throw new Error("RUNWAY MODEL NOT FOUND");

        }

    }

    throw new Error("ENGINE NOT FOUND");

}

module.exports = { run };
