const API_BASE = "https://api.sn-designstudio.dev";

async function loadUserStatus(){
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if(tokenFromUrl){
        localStorage.setItem("sn_token", tokenFromUrl);
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    const token = localStorage.getItem("sn_token");
    if(!token) return window.location.replace("/login.html");

    try {
        const res = await fetch(`${API_BASE}/auth/me`, {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if(!res.ok) throw new Error("UNAUTHORIZED");

        const data = await res.json();
        if(data.ok && data.user){
            const credEl = document.getElementById("user-credits");
            if(credEl) credEl.innerText = data.user.credits || "0";
            
            const emailEl = document.getElementById("user-email");
            if(emailEl) emailEl.innerText = data.user.email;

            const authBtn = document.querySelector(".btn-status-auth");
            if(authBtn) authBtn.innerText = "ONLINE";
        }
    } catch(e) {
        console.error("Auth Error:", e);
        localStorage.removeItem("sn_token");
        window.location.replace("/login.html");
    }
}
document.addEventListener("DOMContentLoaded", loadUserStatus);
