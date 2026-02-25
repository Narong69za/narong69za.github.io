const ADMIN_KEY = "sn_ultra_admin_2026";
const API = "https://sn-design-api.onrender.com/admin-api";

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
