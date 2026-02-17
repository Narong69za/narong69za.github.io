const API="/api";

async function load(){

const server=await fetch(API+"/status/server").then(r=>r.json());
document.getElementById("server").innerText=JSON.stringify(server,null,2);

const users=await fetch(API+"/live-users").then(r=>r.json());
document.getElementById("users").innerText=JSON.stringify(users,null,2);

const queue=await fetch(API+"/api/admin/queue",{headers:{"x-admin":"true"}}).then(r=>r.json());
document.getElementById("queue").innerText=JSON.stringify(queue,null,2);

const wallet=await fetch(API+"/admin/wallet",{headers:{"x-admin":"true"}}).then(r=>r.json());
document.getElementById("wallet").innerText=JSON.stringify(wallet,null,2);

}

setInterval(load,1500);
load();

function testTopup(){

fetch("/api/wallet/deposit",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({user:"dev",amount:50})
});

}

function clearQueue(){

fetch("/api/admin/clear-queue",{headers:{"x-admin":"true"}});

}

function restart(){

alert("restart command placeholder");

}
async function cancelJob(id){

await fetch("/api/admin/job/cancel?id="+id,{
headers:{"x-admin":"true"}
});

}

async function addCredit(user,amount){

await fetch("/api/admin/wallet/add",{
method:"POST",
headers:{
"Content-Type":"application/json",
"x-admin":"true"
},
body:JSON.stringify({user,amount})
});

}
