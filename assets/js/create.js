/**
 * [create.js] - MASTER SYNC (RECOVERY VERSION)
 * เชื่อมต่อ 14 Engines + ระบบเช็คสิทธิ์ Google Auth
 */
// แก้ไข: ระบุพอร์ต Backend ให้ตรงกับที่รันอยู่ (5002)
const API_BASE = "http://localhost:5002"; 

// --- ส่วนที่กู้คืน: ระบบเช็คสถานะผู้ใช้งาน ---
async function syncUserAuth() {
    try {
        const response = await fetch(`${API_BASE}/api/auth/status`, { 
            credentials: "include" 
        });
        const data = await response.json();

        if (data.authenticated) {
            // อัปเดต UI สถานะที่หน้า Create.html
            document.getElementById('userName').innerText = data.user.name;
            document.getElementById('profileImg').src = data.user.picture;
            
            const roleContainer = document.getElementById('userRole');
            const role = data.user.role || 'user'; // ดึงจาก database.db
            roleContainer.innerHTML = `<span class="status-badge role-${role.toLowerCase()}">${role}</span>`;
            
            console.log(`System: Welcome ${role} access.`);
        } else {
            // ถ้าไม่มีสิทธิ์ ให้ Redirect ไปหน้า Login ตามระบบเดิม
            window.location.href = "/login.html";
        }
    } catch (err) {
        console.error("Auth Sync Error:", err);
        // กรณี API พอร์ต 5002 ไม่ตอบสนอง
        document.getElementById('userName').innerText = "OFFLINE";
    }
}

// --- ฟังก์ชันเดิม (คงไว้ตามลิขสิทธิ์เดิม) ---
async function runEngine(engineBox) {
    const btn = engineBox.querySelector(".generate-btn");
    const alias = engineBox.dataset.alias || engineBox.dataset.model; // ป้องกัน alias หาย
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
            credentials: "include"
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);

        const jobId = result.job_id;
        preview.innerHTML = `<div class="text-blue-500 animate-pulse text-[10px]">ENGINE IS WORKING...</div>`;

        const checkStatus = setInterval(async () => {
            const statusRes = await fetch(`${API_BASE}/api/status?job=${jobId}`);
            const statusData = await statusRes.json();

            if (statusData.status === "success" || statusData.status === "completed") {
                clearInterval(checkStatus);
                btn.disabled = false;
                btn.innerText = "สำเร็จ!";
                if (statusData.output_url.endsWith(".mp4")) {
                    preview.innerHTML = `<video src="${statusData.output_url}" border="0" controls class="w-full h-full object-cover rounded-xl"></video>`;
                } else {
                    preview.innerHTML = `<img src="${statusData.output_url}" class="w-full h-full object-cover rounded-xl">`;
                }
            } else if (statusData.status === "failed") {
                clearInterval(checkStatus);
                alert("Render Failed!");
                btn.disabled = false;
                btn.innerText = "ลองอีกครั้ง";
            }
        }, 3000);

    } catch (err) {
        alert("Error: " + err.message);
        btn.disabled = false;
        btn.innerText = "ลองอีกครั้ง";
    }
}

// ผูกเหตุการณ์คลิก + รันการเช็คสถานะเมื่อโหลดหน้า
document.addEventListener("DOMContentLoaded", () => {
    syncUserAuth(); // ทวงคืนสถานะ User ทันทีที่เข้าหน้าเว็บ
    
    document.querySelectorAll(".generate-btn").forEach(btn => {
        btn.addEventListener("click", () => runEngine(btn.closest(".engine-box")));
    });
});

