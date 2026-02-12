const Replicate = require("replicate");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// AI test connection
async function generate() {
  return "AI CONNECT READY";
}

// run AI model
async function runAI(model, input) {

  const output = await replicate.run(
    model,
    { input }
  );

  return output;
}

module.exports = {
  generate,
  runAI
};
