const worker = require("./worker");

let running=false;
let list=[];

exports.add=(jobID,jobs)=>{

list.push(jobID);

process(jobs);

};

function process(jobs){

if(running) return;
if(list.length===0) return;

running=true;

const jobID=list.shift();

worker.run(jobID,jobs,()=>{

running=false;

process(jobs);

});

}
