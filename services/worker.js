const projectService = require("./projectService");

let queue=[];
let running=false;

exports.enqueue = (jobID)=>{

   queue.push(jobID);
   processQueue();

};

async function processQueue(){

   if(running) return;
   running=true;

   while(queue.length){

      const jobID = queue.shift();

      const job = await projectService.getProject(jobID);

      if(!job) continue;

      await projectService.updateStatus(jobID,"processing");

      const response = await fetch(
         "https://adverraai.com/videoSystem/motion_control",
         {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
               templateID:job.templateID,
               webhook:"https://sn-designstudio.dev/api/webhook"
            })
         }
      );

      const result = await response.json();

      await projectService.saveExternalJobID(
         jobID,
         result.externalID
      );

   }

   running=false;
}
