/**
 * [create.js] - MASTER SYNC (PRODUCTION VERSION)
 */
const API_BASE = "https://api.sn-designstudio.dev"; // ใช้ Domain จริงตาม Backend Config

async function syncUserAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = "/login.html"; // หรือหน้าที่คุณใช้ Login
        return;
    }

    try {
        // เปลี่ยนให้ตรงกับ Backend (app.use("/auth", authRoutes))
        const response = await fetch(`${API_BASE}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (data.ok && data.user) {
            const user = data.user;
            document.getElementById('userName').innerText = user.email.split('@')[0];
            // จัดการ Role ให้ตรงกับ CSS (ADMIN/DEV/USER)
            const role = (user.role || 'user').toLowerCase();
            const roleContainer = document.getElementById('userRole');
            roleContainer.innerHTML = `<span class="status-badge role-${role}">${role}</span>`;
            
            if(user.picture) document.getElementById('profileImg').src = user.picture;
        }
    } catch (err) {
        console.error("Auth Sync Error:", err);
        document.getElementById('userName').innerText = "OFFLINE";
    }
}

async function runEngine(engineBox) {
    const btn = engineBox.querySelector(".generate-btn");
    const token = localStorage.getItem('token');
    // ดึง model มาใช้เป็น alias ตามที่ Backend Controller รอรับ
    const alias = engineBox.dataset.model; 
    const prompt = engineBox.querySelector(".engine-prompt").value;
    const res = engineBox.querySelector(".engine-resolution").value;
    const fileInput = engineBox.querySelector(".engine-fileA");
    const preview = engineBox.querySelector(".engine-preview");

    if (!prompt && !fileInput.files[0]) return alert("กรุณาใส่ข้อมูล Prompt หรือรูปภาพ");

    try {
        btn.disabled = true;
        btn.innerText = "กำลังเรนเดอร์...";

        const formData = new FormData();
        formData.append("alias", alias);
        formData.append("prompt", prompt);
        formData.append("resolution", res);
        if (fileInput.files[0]) formData.append("file", fileInput.files[0]);

        const response = await fetch(`${API_BASE}/api/render`, {
            method: "POST",
            body: formData,
            headers: { 'Authorization': `Bearer ${token}` } // ส่ง Token ไปด้วย
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);

        const jobId = result.job_id;
        preview.innerHTML = `<div class="text-blue-500 animate-pulse text-[10px]">ENGINE IS WORKING...</div>`;

        // แก้ไข Path การเช็คสถานะให้ตรงกับ index.js (/api/payment)
        const checkStatus = setInterval(async () => {
            const statusRes = await fetch(`${API_BASE}/api/payment/status?job=${jobId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const statusData = await statusRes.json();

            if (statusData.status === "success" || statusData.status === "completed") {
                clearInterval(checkStatus);
                btn.disabled = false;
                btn.innerText = `RUN ENGINE ${engineBox.dataset.engine}`;
                if (statusData.output_url.endsWith(".mp4")) {
                    preview.innerHTML = `<video src="${statusData.output_url}" controls autoplay loop class="w-full h-full object-cover rounded-xl"></video>`;
                } else {
                    preview.innerHTML = `<img src="${statusData.output_url}" class="w-full h-full object-cover rounded-xl">`;
                }
            } else if (statusData.status === "failed") {
                clearInterval(checkStatus);
                alert("Render Failed!");
                btn.disabled = false;
            }
        }, 4000);

    } catch (err) {
        alert("Error: " + err.message);
        btn.disabled = false;
        btn.innerText = "ลองอีกครั้ง";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    syncUserAuth();
    document.querySelectorAll(".generate-btn").forEach(btn => {
        btn.addEventListener("click", () => runEngine(btn.closest(".engine-box")));
    });
});

