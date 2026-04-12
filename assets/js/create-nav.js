const API_BASE = "https://api.sn-designstudio.dev";
const DEV_MODE = false;

async function loadUserStatus(){
    const creditBtn = document.getElementById("btn-credit");
    const adminBtn  = document.getElementById("btn-admin");
    try{
        const res = await fetch(`${API_BASE}/auth/me`,{ credentials:"include", cache:"no-store" });
        if(!res.ok){
            if(!DEV_MODE && res.status===401) window.location.replace("/login.html");
            return;
        }
        const data = await res.json();
        const user = data.user;
        const role = (user.role || "").toLowerCase();

        if(role === "owner" || role === "admin"){
            if(creditBtn) creditBtn.style.display="inline-block";
            if(adminBtn)  adminBtn.style.display="inline-block";
        } else {
            if(creditBtn) creditBtn.style.display="inline-block";
            if(adminBtn)  adminBtn.style.display="none";
        }
    }catch(err){ console.warn("USER LOAD ERROR:",err); }
}
document.addEventListener("DOMContentLoaded", loadUserStatus);

document.addEventListener("click",(e)=>{
    if(e.target.id==="btn-credit") window.location.href="/payment.html";
    if(e.target.id==="btn-admin") window.location.href="/payment-control.html";
});

