//models/model.router.js

const runwayEngine = require("../services/runwayml/v1");

async function run({ userId, engine, payload }) {

   try {

      if (!engine) {
         throw new Error("ENGINE NOT SPECIFIED");
      }

      /* ===============================
         RUNWAY AUTO ENGINE
      =============================== */

      if (engine === "runwayml") {

         console.log("MODEL ROUTER → RUNWAY AUTO");

         return await runwayEngine.run({
            payload
         });

      }

      throw new Error("RUNWAY MODEL NOT FOUND");

   } catch (err) {

      console.error("MODEL ROUTER ERROR:", err.message);
      throw err;

   }

}

module.exports = { run };
