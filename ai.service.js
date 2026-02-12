const Replicate = require("replicate");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
exports.generate = async () => {
  return 'AI CONNECT READY';
};
