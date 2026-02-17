const engine = require("../engine/motionEngine");
const project = require("./projectService");

module.exports = {

   async process(job){

      await project.update(job.id,{
         status:"running",
         progress:10
      });

      const result = await engine.run(job);

      await project.update(job.id,result);

   }

};
