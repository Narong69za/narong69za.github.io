const ADMIN_KEY = "SN_DESIGN_AI_DEV-2499";
const API = "https://api.sn-designstudio.dev/admin-api";

async function loadUsers(){

   const res = await fetch(`${API}/users`,{

      headers:{
         "x-admin-key": ADMIN_KEY
      }

   });

   const data = await res.json();

   console.log("USERS:",data);

}

async function addCredit(userId,amount){

   await fetch(`${API}/add-credit`,{

      method:"POST",
      headers:{
         "Content-Type":"application/json",
         "x-admin-key": ADMIN_KEY
      },
      body: JSON.stringify({
         userId,
         amount
      })

   });

   alert("เครดิตเพิ่มแล้ว");

}
