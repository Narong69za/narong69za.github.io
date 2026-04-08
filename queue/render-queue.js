// ULTRA CLUSTER QUEUE

const jobs=[];

function addJob(data){

 const id=Date.now()+"-"+Math.random();

 jobs.push({
   id,
   status:"waiting",
   created:Date.now(),
   ...data
 });

 return id;
}

function getNext(){

 return jobs.find(j=>j.status==="waiting");

}

function updateJob(id,data){

 const job=jobs.find(j=>j.id===id);

 if(job) Object.assign(job,data);

}

function getJob(id){

 return jobs.find(j=>j.id===id);

}

module.exports={
 addJob,
 getNext,
 updateJob,
 getJob
};
