async function update(){

   try{

      const server=await adminFetch("/api/status/server");
      document.getElementById("server").innerText=
      JSON.stringify(server,null,2);

   }catch{}

   try{

      const users=await adminFetch("/api/live-users");
      document.getElementById("users").innerText=
      JSON.stringify(users,null,2);

   }catch{}

   try{

      const jobs=await adminFetch("/api/jobs");
      document.getElementById("jobs").innerText=
      JSON.stringify(jobs,null,2);

   }catch{}

   try{

      const wallet=await adminFetch("/api/admin/wallet");
      document.getElementById("wallet").innerText=
      JSON.stringify(wallet,null,2);

   }catch{}

}

setInterval(update,1500);

update();
