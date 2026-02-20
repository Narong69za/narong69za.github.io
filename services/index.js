/*
=====================================
SERVICE INDEX FINAL
=====================================
*/

const modelRouter = require("./model.router");

async function run(data){

   return await modelRouter.runModel(data);

}

module.exports = {
   run
};
