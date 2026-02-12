// =============================
// SN DESIGN AI SERVICE
// ULTRA LOCK VERSION
// =============================

const Replicate = require("replicate");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});


// =============================
// TEST CONNECTION
// =============================

async function generate() {
  return "AI CONNECT READY";
}


// =============================
// RUN AI MODEL
// =============================

async function runAI(model, input) {

  try {

    const output = await replicate.run(
      model,
      {
        input: input
      }
    );

    return output;

  } catch (err) {

    console.error("AI ERROR:", err);

    throw new Error("AI PROCESS FAILED");

  }

}


module.exports = {
  generate,
  runAI
};
