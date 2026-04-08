/**
 * [create.js] - MASTER SYNC
 * เชื่อมต่อปุ่ม Generate ทั้ง 14 Engines
 */
const API_BASE = ""; // ปล่อยว่างไว้เพราะรันบน Domain เดียวกัน

async function runEngine(engineBox) {
    const btn = engineBox.querySelector(".generate-btn");
    const alias = engineBox.dataset.alias;
    const prompt = engineBox.querySelector(".engine-prompt").value;
    const res = engineBox.querySelector(".engine-resolution").value;
    const fileInput = engineBox.querySelector(".engine-fileA");
    const preview = engineBox.querySelector(".engine-preview");

    if (!prompt && !fileInput.files[0]) return alert("กรุณาใส่ข้อมูล Prompt หรือรูปภาพ");

    try {
        btn.disabled = true;
        btn.innerText = "กำลังเรนเดอร์...";
        
        // 1. เตรียม Data (ใช้ FormData เพื่อรองรับไฟล์)
        const formData = new FormData();
        formData.append("alias", alias);
        formData.append("prompt", prompt);
        formData.append("resolution", res);
        if (fileInput.files[0]) formData.append("file", fileInput.files[0]);

        // 2. ยิงเข้า Backend API
        const response = await fetch(`${API_BASE}/api/render`, {
            method: "POST",
            body: formData,
            credentials: "include"
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);

        // 3. Polling เช็คสถานะงาน
        const jobId = result.job_id;
        preview.innerHTML = `<div class="text-blue-500 animate-pulse text-[10px]">ENGINE IS WORKING...</div>`;

        const checkStatus = setInterval(async () => {
            const statusRes = await fetch(`${API_BASE}/api/payment/status?job=${jobId}`);
            const statusData = await statusRes.json();

            if (statusData.status === "success" || statusData.status === "completed") {
                clearInterval(checkStatus);
                btn.disabled = false;
                btn.innerText = "สำเร็จ!";
                // แสดงผลลัพธ์ (รูป/วิดีโอ)
                if (statusData.output_url.endsWith(".mp4")) {
                    preview.innerHTML = `<video src="${statusData.output_url}" controls class="w-full h-full object-cover rounded-xl"></video>`;
                } else {
                    preview.innerHTML = `<img src="${statusData.output_url}" class="w-full h-full object-cover rounded-xl">`;
                }
            } else if (statusData.status === "failed") {
                clearInterval(checkStatus);
                alert("Render Failed!");
                btn.disabled = false;
            }
        }, 3000);

    } catch (err) {
        alert("Error: " + err.message);
        btn.disabled = false;
        btn.innerText = "ลองอีกครั้ง";
    }
}

// ผูกเหตุการณ์คลิก
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".generate-btn").forEach(btn => {
        btn.addEventListener("click", () => runEngine(btn.closest(".engine-box")));
    });
});
