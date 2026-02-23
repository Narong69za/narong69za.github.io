const replicate = require("../services/replicate/replicate.service");
const runway = require("../services/runway/runway.service");

exports.run = async (payload) => {

   const engine = payload.engine;

   if (engine === "replicate") {
      return await replicate.run(payload);
   }

   if (engine === "runway") {
      return await runway.run(payload);
   }

   throw new Error("ENGINE NOT SUPPORTED");
};
