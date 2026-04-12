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
        const res = await fetch(\`\${API_BASE}/auth/me\`, {
            headers: { "Authorization": \`Bearer \${token}\` }
        });
        if(!res.ok) throw new Error();
        const data = await res.json();
        if(document.getElementById("btn-credit")) document.getElementById("btn-credit").style.display="inline-block";
    } catch(e) { window.location.replace("/login.html"); }
}
document.addEventListener("DOMContentLoaded", loadUserStatus);
