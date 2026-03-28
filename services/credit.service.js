const usageStore={};

function checkUsage(user){

if(user.dev===true){

return { allow:true };

}

const key=user.email;

if(!usageStore[key]) usageStore[key]=0;

usageStore[key]++;

if(usageStore[key]>3){

return { allow:false };

}

return { allow:true };

}

module.exports={ checkUsage };
