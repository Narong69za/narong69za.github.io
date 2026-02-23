// model.router.js

const worker = require("./job.worker");

exports.run = async (payload)=>{

   return await worker.run(payload);

};
