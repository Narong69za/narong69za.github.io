const CLIENT_ID = "322233270752-6itdqaskdsdbc7lu2t3fchm792slct4n.apps.googleusercontent.com";

function initAuth(){
   // เช็คผ่าน Cookie แทน (ส่ง credentials: include ไปถาม API)
   checkExistingSession();

   google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCredentialResponse
   });

   google.accounts.id.prompt();
}

async function checkExistingSession(){
    try {
        const res = await fetch("https://api.sn-designstudio.dev/auth/me", { credentials: "include" });
        if(res.ok) {
            console.log("✅ SESSION ACTIVE (via Cookie)");
            // ถ้าอยู่ในหน้า Login ให้ดีดไปหน้า Create
            if(window.location.pathname.includes("login.html")) {
                window.location.href = "/create.html";
            }
        }
    } catch(e) {}
}

async function handleCredentialResponse(response){
   try{
      const token = response.credential; 

      const verify = await fetch(
         "https://api.sn-designstudio.dev/auth/google/verify", // ชี้ไปที่ API ตรงๆ
         {
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body: JSON.stringify({ token }),
            credentials: "include" // สำคัญมาก: เพื่อให้ Backend เซต Cookie กลับมาได้
         }
      );

      const data = await verify.json();

      if(data.success || data.ok){
         // ไม่ต้องเก็บใน localStorage แล้ว เพราะ Backend เซต Cookie ให้เรียบร้อย
         window.location.href = "/create.html";
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

