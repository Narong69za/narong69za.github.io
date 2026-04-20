// ==========================================
// 1. ระบบกราฟ Resource Analytics (Chart.js)
// ==========================================
let sysChart = null;

function bootChart(){
    const cv = document.getElementById("sysChart");
    if(!cv) return;
    sysChart = new Chart(cv.getContext("2d"), {
        type: "line",
        data: { 
            labels: Array(20).fill(""), 
            datasets: [
                { label: "CPU", data: Array(20).fill(0), borderColor: "#bf5af2", fill: false, tension: 0.4 },
                { label: "RAM", data: Array(20).fill(0), borderColor: "#32d74b", fill: false, tension: 0.4 }
            ]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            animation: false, 
            scales: { y: { min: 0, max: 100 } },
            plugins: { legend: { display: false } }
        }
    });
}

// ==========================================
// 2. ระบบสั่งการ Game Servers
// ==========================================
async function controlServer(engine, action) {
    try {
        showToast(`Sending ${action} to ${engine}...`, "warning");
        const data = await apiFetch('/api/system/control', 'POST', { engine, action });
        if(data.success) {
            showToast("Command success", "success");
        } else {
            showToast("Command failed", "error");
        }
    } catch(e) { 
        showToast("Server API error", "error"); 
    }
}

// ==========================================
// 3. ระบบดึงข้อมูล ENGINE CREDITS (จากของจริง)
// ==========================================
async function fetchEngineCredits() {
    try {
        const res = await apiFetch('/api/billing/usage', 'GET'); 
        
        if (res && res.success) {
            let runway = 0, replicate = 0, gemini = 0, eleven = 0;
            
            // เช็คว่ามีข้อมูลใน array rows หรือไม่
            if (res.rows && res.rows.length > 0) {
                res.rows.forEach(r => {
                    const s = String(r.service || '').toLowerCase();
                    if(s.includes('runway')) runway += Number(r.total || 0);
                    if(s.includes('replicate')) replicate += Number(r.total || 0);
                    if(s.includes('gemini')) gemini += Number(r.total || 0);
                    if(s.includes('eleven')) eleven += Number(r.total || 0);
                });
            }

            // โยนค่าขึ้นหน้าจอ
            document.getElementById('cr-runway').innerText = '$' + runway.toFixed(2);
            document.getElementById('cr-replicate').innerText = '$' + replicate.toFixed(2);
            document.getElementById('cr-gemini').innerText = '$' + gemini.toFixed(2);
            document.getElementById('cr-eleven').innerText = eleven.toLocaleString();
        }
    } catch (e) {
        console.error("Credits Sync Error:", e);
    }
}

// ==========================================
// 4. ตัวปลุกระบบทั้งหมดตอนหน้าเว็บโหลดเสร็จ (Main Initialization)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem("sn_jwt");
    
    // ถ้ามี Token (ล็อคอินแล้ว)
    if (token) {
        // ปิดหน้าจอ Login
        document.getElementById("login-overlay").style.display = "none";
        
        // แสดง Role ของ User
        const badge = document.getElementById("role-badge");
        if (badge) {
            badge.classList.remove("hidden");
            badge.innerText = "ROLE: " + (localStorage.getItem("sn_role") || "ADMIN");
        }
        
        // รันระบบต่างๆ ทันที
        bootChart();
        fetchEngineCredits(); // ดึงข้อมูลเครดิตจริง
        
        // เชื่อมต่อระบบ Real-Time ถ้าไฟล์ socket.js ทำงานปกติ
        if (typeof initSocket === 'function') initSocket(token);
        
        // โหลดคลิป YouTube ถ้าไฟล์ youtube.js ทำงานปกติ
        if (typeof onYouTubeIframeAPIReady === 'function') onYouTubeIframeAPIReady();
        
        // เช็คสถานะ Faucet ถ้าเคยปลดล็อคแล้วให้รันต่อ
        if (localStorage.getItem("faucet_registered") === "1" && typeof startTermuxBot === 'function') {
            document.getElementById("faucet-locked").style.display = "none";
            document.getElementById("faucet-content").classList.remove("blur-sm");
            startTermuxBot();
        }
        
    } else {
        // ถ้าไม่มี Token บังคับโชว์หน้า Login
        document.getElementById("login-overlay").style.display = "flex";
    }
});

