let sysChart = null;

function bootChart(){
    const cv = document.getElementById("sysChart");
    if(!cv) return;
    sysChart = new Chart(cv.getContext("2d"), {
        type: "line",
        data: { labels: Array(20).fill(""), datasets: [
            { label: "CPU", data: Array(20).fill(0), borderColor: "#bf5af2", fill: false },
            { label: "RAM", data: Array(20).fill(0), borderColor: "#32d74b", fill: false }
        ]},
        options: { responsive: true, maintainAspectRatio: false, animation: false, scales: { y: { min: 0, max: 100 } } }
    });
}

async function controlServer(engine, action) {
    try {
        showToast(`Sending ${action} to ${engine}...`);
        const data = await apiFetch('/api/system/control', 'POST', { engine, action });
        if(data.success) showToast("Command success");
        else showToast("Command failed", "error");
    } catch(e) { showToast("Server API error", "error"); }
}

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem("sn_jwt");
    if (token) {
        document.getElementById("login-overlay").style.display = "none";
        const badge = document.getElementById("role-badge");
        if (badge) {
            badge.classList.remove("hidden");
            badge.innerText = "ROLE: " + (localStorage.getItem("sn_role") || "ADMIN");
        }
        
        bootChart();
        
        if (typeof initSocket === 'function') initSocket(token);
        if (typeof onYouTubeIframeAPIReady === 'function') onYouTubeIframeAPIReady();
        
        if (localStorage.getItem("faucet_registered") === "1" && typeof startTermuxBot === 'function') {
            document.getElementById("faucet-locked").style.display = "none";
            document.getElementById("faucet-content").classList.remove("blur-sm");
            startTermuxBot();
        }
    } else {
        document.getElementById("login-overlay").style.display = "flex";
    }
});

