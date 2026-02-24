// services/model.router.js

const runway = require("./runwayml/v1");
const db = require("../db/db");

async function run({ engine, mode, prompt, files }) {

  const projectID = await db.createProject({
    engine,
    mode,
    prompt,
    fileAUrl: files?.fileAUrl || null,
    fileBUrl: files?.fileBUrl || null
  });

  if (engine === "runway") {

    const result = await runway.run({
      mode,
      payload: {
        prompt,
        imageUrl: files?.fileAUrl,
        videoUri: files?.fileAUrl
      }
    });

    if (result.id) {
      await db.updateProcessing(projectID, result.id);
    }

    return { projectID };

  }

  throw new Error("ENGINE NOT SUPPORTED");

}

module.exports = { run };
