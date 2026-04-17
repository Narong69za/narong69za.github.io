const API = "";

const headers={"x-admin":"true"};

async function load(){

   const s=await fetch("/api/status/server").then(r=>r.json());
   document.getElementById("server").innerText=JSON.stringify(s,null,2);

   const u=await fetch("/api/live-users").then(r=>r.json());
   document.getElementById("users").innerText=JSON.stringify(u,null,2);

   const q=await fetch("/api/admin/queue",{headers}).then(r=>r.json());
   document.getElementById("queue").innerText=JSON.stringify(q,null,2);

   const w=await fetch("/api/admin/wallet",{headers}).then(r=>r.json());
   document.getElementById("wallet").innerText=JSON.stringify(w,null,2);

}

async function test(){

   await fetch("/api/wallet/deposit",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({user:"admin",amount:50})
   });

}

setInterval(load,2000);

load();
