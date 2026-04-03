/** * [create.js] 
 * หัวใจหลักในการเชื่อมต่อ Backend
 */
const API_BASE = "https://api.sn-designstudio.dev"; // พาร์ทเนอร์เปลี่ยนเป็น IP/Domain จริงของมึงนะ

// [MASTER FUNCTION] เริ่มต้นระบบ Render
async function startRenderPipeline(engineBox) {
    const alias = engineBox.dataset.alias;
    const engineId = engineBox.dataset.engine;
    const prompt = engineBox.querySelector(".engine-prompt").value;
    const fileInput = engineBox.querySelector(".engine-fileA");
    const btn = engineBox.querySelector(".generate-btn");
    const preview = engineBox.querySelector(".engine-preview");

    if (!prompt && !fileInput.files[0]) return alert("กรุณาใส่ข้อมูล!");

    try {
        // 1. เปลี่ยนปุ่มเป็น Loading
        const originalText = btn.innerText;
        btn.innerText = "RENDERING...";
        btn.disabled = true;
        preview.innerHTML = `<div class="animate-pulse text-blue-500 text-[9px] uppercase font-bold">Processing Engine ${engineId}...</div>`;

        // 2. สร้าง FormData (รองรับทั้งข้อความและไฟล์)
        const formData = new FormData();
        formData.append("alias", alias);
        formData.append("prompt", prompt);
        formData.append("resolution", engineBox.querySelector(".engine-resolution").value);
        if (fileInput.files[0]) formData.append("file", fileInput.files[0]);

        // 3. ยิงไป Backend
        const response = await fetch(`${API_BASE}/api/render`, {
            method: "POST",
            body: formData, // ห้ามใส่ Content-Type เมื่อใช้ FormData
            credentials: "include" // ส่ง Session/Cookie ไปด้วย
        });

        const startResult = await response.json();
        if (!startResult.success) throw new Error(startResult.message || "Server Rejected");

        const jobId = startResult.job_id;

        // 4. Polling ระบบติดตามงาน
        let attempts = 0;
        const checkStatus = setInterval(async () => {
            attempts++;
            const statusRes = await fetch(`${API_BASE}/api/render-status?job=${jobId}`);
            const data = await statusRes.json();

            console.log(`Job ${jobId} Status:`, data.status);

            if (data.status === "completed" || data.status === "success") {
                clearInterval(checkStatus);
                renderOutput(preview, data.output_url); // แสดงผลลัพธ์
                btn.innerText = "SUCCESS!";
                setTimeout(() => { btn.innerText = originalText; btn.disabled = false; }, 3000);
            } else if (data.status === "failed" || attempts > 100) {
                clearInterval(checkStatus);
                alert("งานนี้พัง หรือใช้เวลานานเกินไป!");
                btn.disabled = false;
                btn.innerText = originalText;
            }
        }, 3000); // เช็คทุก 3 วินาที

    } catch (err) {
        console.error("Pipeline Error:", err);
        alert(err.message);
        btn.disabled = false;
    }
}

// ฟังก์ชันโชว์รูปหรือวิดีโอที่เสร็จแล้ว
function renderOutput(preview, url) {
    if (url.endsWith(".mp4") || url.endsWith(".webm")) {
        preview.innerHTML = `<video src="${url}" controls class="w-full h-full object-cover rounded-xl shadow-2xl animate-in zoom-in-95 duration-500"></video>`;
    } else {
        preview.innerHTML = `<img src="${url}" class="w-full h-full object-cover rounded-xl shadow-2xl animate-in zoom-in-95 duration-500">`;
    }
}

// ผูกปุ่มเข้ากับระบบเมื่อหน้าโหลดเสร็จ
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".generate-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            startRenderPipeline(btn.closest(".engine-box"));
        });
    });

    // File Preview เบื้องต้น
    document.querySelectorAll(".engine-fileA").forEach(input => {
        input.addEventListener("change", (e) => {
            const preview = input.closest(".engine-box").querySelector(".engine-preview");
            const file = e.target.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                preview.innerHTML = `<img src="${url}" class="w-full h-full object-cover rounded-xl opacity-50 border-2 border-dashed border-blue-500/50">`;
            }
        });
    });
});
                    
