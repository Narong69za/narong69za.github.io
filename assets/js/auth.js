const CLIENT_ID = "322233270752-6itdqaskdsdbc7lu2t3fchm792slct4n.apps.googleusercontent.com";

function initAuth(){

   // ถ้ามี session แล้ว ไม่ต้อง login ใหม่
   if(localStorage.getItem("sn_user")){
      console.log("SESSION ACTIVE");
      return;
   }

   google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCredentialResponse
   });

   // silent login (ไม่มี popup ถ้าเคย login)
   google.accounts.id.prompt();

}

async function handleCredentialResponse(response){

   try{

      const token = response.credential; // JWT จาก Google

      const verify = await fetch(
         "https://api.sn-designstudio.dev/api/auth/google",
         {
            method:"POST",
            headers:{
               "Content-Type":"application/json"
            },
            body: JSON.stringify({ token })
         }
      );

      const data = await verify.json();

      if(data.success){

         localStorage.setItem(
            "sn_user",
            JSON.stringify(data.user)
         );

         location.reload();

      }

   }catch(e){
      console.log("AUTH ERROR", e);
   }

}

window.addEventListener("load",()=>{
   if(window.google){
      initAuth();
   }
});
