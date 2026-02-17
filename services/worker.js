exports.run=(jobID,jobs,done)=>{

jobs[jobID].status="processing";

let progress=0;

const interval=setInterval(()=>{

progress+=5;

jobs[jobID].progress=progress;

if(progress>=100){

jobs[jobID].status="complete";

clearInterval(interval);

done();

}

},1500);

};
