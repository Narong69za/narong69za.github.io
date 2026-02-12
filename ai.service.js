const Replicate = require("replicate");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
exports.generate = async () => {
  return 'AI CONNECT READY';
};
async function runAI(model, input) {

  const output = await replicate.run(
    model,
    { input }
  );

  return output;
}

module.exports = {
  runAI
};
