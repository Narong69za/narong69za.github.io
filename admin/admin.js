async function loadServer(){

   const res = await fetch("/api/status/server");
   const data = await res.json();

   document.getElementById("server").innerText =
      JSON.stringify(data,null,2);
}

async function loadUsers(){

   const res = await fetch("/api/live-users");
   const data = await res.json();

   document.getElementById("users").innerText =
      JSON.stringify(data,null,2);
}

async function loadQueue(){

   const res = await fetch("/api/admin/queue",{
      headers:ADMIN_HEADER
   });

   const data = await res.json();

   document.getElementById("queue").innerText =
      JSON.stringify(data,null,2);
}

async function loadWallet(){

   const res = await fetch("/api/admin/wallet",{
      headers:ADMIN_HEADER
   });

   const data = await res.json();

   document.getElementById("wallet").innerText =
      JSON.stringify(data,null,2);
}

async function testTopup(){

   await fetch("/api/admin/topup",{

      method:"POST",

      headers:{
         "Content-Type":"application/json",
         ...ADMIN_HEADER
      },

      body:JSON.stringify({
         user:"test",
         amount:50
      })

   });

   loadWallet();
}

setInterval(()=>{

   loadServer();
   loadUsers();
   loadQueue();
   loadWallet();

},3000);
