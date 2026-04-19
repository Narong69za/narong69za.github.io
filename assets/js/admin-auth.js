const API_BASE = "https://api.sn-designstudio.dev";

async function loginAdmin() {
    const user = document.getElementById("admin-user")?.value.trim();
    const pass = document.getElementById("admin-pass")?.value;
    const err = document.getElementById("login-error");

    if(err) err.style.display = "none";

    if(!user || !pass){
        err.innerText = "ENTER USERNAME / PASSWORD";
        err.style.display = "block";
        return;
    }

    try{
        const res = await fetch(API_BASE + "/api/admin/login",{
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body: JSON.stringify({
                username:user,
                password:pass
            })
        });

        const data = await res.json();
        console.log(data);

        if(res.ok && (data.success || data.token)){
            localStorage.setItem("sn_jwt", data.token);
            localStorage.setItem("sn_role", data.role || "ADMIN");
            location.reload();
        }else{
            err.innerText = data.message || "LOGIN FAILED";
            err.style.display = "block";
        }

    }catch(e){
        err.innerText = "API OFFLINE";
        err.style.display = "block";
    }
}

function logoutAdmin(){
    localStorage.removeItem("sn_jwt");
    localStorage.removeItem("sn_role");
    location.reload();
}

window.loginAdmin = loginAdmin;
window.logoutAdmin = logoutAdmin;
