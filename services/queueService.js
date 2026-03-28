const worker = require("./worker");
const project = require("./projectService");

module.exports = {

   async addJob(data){

      if(!data.engine) throw new Error("ENGINE REQUIRED");

      const job = {

         id: Date.now().toString(),
         templateID: data.templateID,
         engine: data.engine,
         duration: data.duration

      };

      await project.create(job);

      worker.process(job); // async background

      return job;

   }

};
