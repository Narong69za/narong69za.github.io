/**
 * [create.js] - SN ULTRA ENGINE MASTER SYNC (v9.2.1)
 * ยึดตามโครงสร้าง CTA_MODEL_MASTER และ ENGINE_DATA
 */
import { CTA_MODEL_MASTER } from './cta.model.master.js';

const API_BASE = "https://api.sn-designstudio.dev";

// [FUNCTION 1] กฎเหล็ก: เช็คสิทธิ์และเครดิตจาก Database จริง
async function checkSystemAuth() {
    const token = localStorage.getItem('token');
    
    // ถ้าไม่มี Token ต้องเด้งไปหน้า Login ทันที
    if (!token) {
        window.location.href = "https://sn-designstudio.dev/login.html";
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.ok && data.user) {
            // อัปเดต UI หน้า Dashboard
            document.getElementById('userName').innerText = data.user.email.split('@')[0];
            const role = (data.user.role || 'user').toLowerCase();
            document.getElementById('userRole').innerHTML = `<span class="status-badge role-${role}">${role}</span>`;
            if(data.user.picture) document.getElementById('profileImg').src = data.user.picture;
            
            console.log(`✅ [Master Sync] User: ${data.user.email} | Credits: ${data.user.credits}`);
        } else {
            throw new Error("Invalid Session");
        }
    } catch (err) {
        localStorage.removeItem('token');
        window.location.href = "https://sn-designstudio.dev/login.html";
    }
}

// [FUNCTION 2] สั่งรัน Engine ตาม Master Data
async function runEngine(engineBox) {
    const engineId = engineBox.dataset.engine; // ID 1-14
    const masterData = CTA_MODEL_MASTER[engineId]; // ดึงข้อมูลจาก v9.1 Master
    
    if (!masterData) return alert("Engine Data Not Found!");

    const btn = engineBox.querySelector(".generate-btn");
    const token = localStorage.getItem('token');
    const prompt = engineBox.querySelector(".engine-prompt").value;
    const res = engineBox.querySelector(".engine-resolution").value;
    const fileInput = engineBox.querySelector(".engine-fileA");
    const preview = engineBox.querySelector(".engine-preview");

    if (!prompt && !fileInput.files[0]) return alert("กรุณาใส่ข้อมูล Prompt หรือรูปภาพ");

    try {
        btn.disabled = true;
        btn.innerText = "CHECKING CREDITS...";

        const formData = new FormData();
        // ส่งค่าตามระบบ v9.1: alias และ model จาก Master Data
        formData.append("alias", masterData.alias);
        formData.append("model", masterData.model);
        formData.append("prompt", prompt);
        formData.append("resolution", res);
        if (fileInput.files[0]) formData.append("file", fileInput.files[0]);

        // ยิงเข้า Backend API (พอร์ต 5002)
        const response = await fetch(`${API_BASE}/api/render`, {
            method: "POST",
            body: formData,
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const result = await response.json();
        
        // ถ้าเครดิตใน database.db ไม่พอ หรือไม่ได้ Login ระบบจะดีดออกที่นี่
        if (!result.success) throw new Error(result.message || "Unauthorized / Insufficient Credits");

        const jobId = result.job_id;
        preview.innerHTML = `<div class="text-blue-500 animate-pulse text-[10px]">ENGINE: ${masterData.alias.toUpperCase()} IS WORKING...</div>`;

        // Polling สถานะงาน (ใช้ Path /api/payment/status ตามที่ระบุใน index.js)
        const checkStatus = setInterval(async () => {
            const statusRes = await fetch(`${API_BASE}/api/payment/status?job=${jobId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const statusData = await statusRes.json();

            if (statusData.status === "success" || statusData.status === "completed") {
                clearInterval(checkStatus);
                btn.disabled = false;
                btn.innerText = `SUCCESS! (E${engineId})`;
                preview.innerHTML = statusData.output_url.endsWith(".mp4") 
                    ? `<video src="${statusData.output_url}" controls autoplay loop class="w-full h-full object-cover rounded-xl"></video>`
                    : `<img src="${statusData.output_url}" class="w-full h-full object-cover rounded-xl">`;
            } else if (statusData.status === "failed") {
                clearInterval(checkStatus);
                alert("Render Failed!");
                btn.disabled = false;
            }
        }, 4000);

    } catch (err) {
        alert("System Error: " + err.message);
        btn.disabled = false;
        btn.innerText = "RUN ENGINE";
    }
}

// เริ่มต้นระบบ
document.addEventListener("DOMContentLoaded", () => {
    checkSystemAuth();
    document.querySelectorAll(".generate-btn").forEach(btn => {
        btn.addEventListener("click", () => runEngine(btn.closest(".engine-box")));
    });
});

