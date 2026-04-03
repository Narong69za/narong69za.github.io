/**
=====================================================
PROJECT: SN DESIGN STUDIO | MODULE: create.js
VERSION: v10.0.0 (ULTRA MASTER SYNC)
STATUS: production-final
LAST FIX: 
- Integrated Alias Mapping for Backend 2026
- Optimized File Upload & Polling Logic
- Fixed Identifier already declared issues
=====================================================
*/
import { buildPayload } from "./payload.builder.js"
import { pollTask } from "./task.poller.js"
import { uploadFile } from "./upload.service.js"
import { logTask } from "./db.logger.js"

// ดึงค่า URL กลางจาก CONFIG
const API_BASE = window.CONFIG ? window.CONFIG.API_BASE_URL : "https://api.sn-designstudio.dev";
const CREDIT_RATE = { 720: 2, 1080: 4 };

// [HELPER] แปลง ID จากหน้า UI ให้เป็น Alias ที่ Backend รู้จัก
const getAliasFromID = (id) => {
    const mapping = {
        "1": "image_to_video",
        "2": "text_to_video",
        "3": "video_transform",
        "4": "text_to_image",
        "5": "fast_image",
        "6": "redux_image",
        "7": "character_motion",
        "8": "video_enhance",
        "9": "video_ai",
        "10": "video_fast",
        "11": "gemini_image",
        "12": "voice_ai",
        "13": "sound_fx",
        "14": "voice_transfer"
    };
    return mapping[id] || null;
};

function updateCreditRate(engine) {
    const res = engine.querySelector(".engine-resolution");
    if (!res) return;
    const rate = CREDIT_RATE[res.value] || 0;
    const credit = engine.querySelector(".credit-rate");
    if (credit) {
        credit.innerText = rate + " credits / sec";
    }
}

function initEngines() {
    const engines = document.querySelectorAll(".engine-box");
    engines.forEach(engine => {
        const res = engine.querySelector(".engine-resolution");
        if (res) {
            res.addEventListener("change", () => updateCreditRate(engine));
            updateCreditRate(engine);
        }
    });

    /* --- 1. FILE PREVIEW SYSTEM --- */
    document.querySelectorAll(".engine-fileA").forEach(input => {
        input.addEventListener("change", (e) => {
            const engine = input.closest(".engine-box");
            if (!engine) return;
            const preview = engine.querySelector(".engine-preview");
            if (!preview) return;
            const file = e.target.files[0];
            if (!file) return;
            const url = URL.createObjectURL(file);

            if (file.type.startsWith("image")) {
                preview.innerHTML = `<img src="${url}" class="rounded-xl shadow-lg" style="max-width:100%">`;
            } else if (file.type.startsWith("video")) {
                preview.innerHTML = `<video src="${url}" controls class="rounded-xl shadow-lg" style="max-width:100%"></video>`;
            } else if (file.type.startsWith("audio")) {
                preview.innerHTML = `<audio src="${url}" controls class="w-full mt-2"></audio>`;
            }
        });
    });

    /* --- 2. GENERATE ENGINE (THE MASTER LOGIC) --- */
    document.querySelectorAll(".generate-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const engineBox = btn.closest(".engine-box");
            if (!engineBox) return;

            const engineId = engineBox.dataset.engine; // เช่น "1", "2"
            const alias = getAliasFromID(engineId);     // เช่น "image_to_video"
            const prompt = engineBox.querySelector(".engine-prompt")?.value || "";
            const file = engineBox.querySelector(".engine-fileA")?.files?.[0] || null;
            const status = document.getElementById("status");
            const preview = engineBox.querySelector(".engine-preview");

            // UI Feedback
            btn.disabled = true;
            const originalBtnText = btn.innerText;
            btn.innerText = "RUNNING...";
            if (status) status.innerText = "สถานะ: กำลังเตรียมข้อมูล (INITIALIZING...)";

            try {
                let image = null, video = null, audio = null;

                // อัปโหลดไฟล์ถ้ามี
                if (file) {
                    if (status) status.innerText = "สถานะ: กำลังอัปโหลดสื่อ (UPLOADING...)";
                    const upload = await uploadFile(file);
                    image = upload.url; 
                    video = upload.url;
                    audio = upload.url;
                }

                // สร้าง Payload ให้ตรงกับที่ Backend Render Controller ต้องการ
                const payload = {
                    alias: alias,
                    prompt: prompt,
                    image: image,
                    video: video,
                    audio: audio,
                    is_test: false, // รันจริงหักเครดิตจริง
                    master_key: "SN_ULTRA_2026_SECRET" // บายพาสสำหรับโหมดแอดมิน
                };

                if (status) status.innerText = "สถานะ: ส่งคำสั่งไปยัง AI (SENDING COMMAND...)";

                const res = await fetch(`${API_BASE}/api/render`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error || "API_RENDER_FAILED");
                }

                const responseData = await res.json();
                
                // เริ่มระบบ Polling รอรับงาน (ใช้ jobId ที่ได้จาก Backend)
                if (status) status.innerText = "สถานะ: AI กำลังทำงาน (AI RENDERING...)";
                
                // สมมติว่า pollTask รองรับ jobId ตัวใหม่
                const result = await pollTask(responseData.job_id || responseData.id);
                logTask(result);

                // แสดงผลลัพธ์ใน Preview
                if (preview && result.output) {
                    const output = result.output[0];
                    if (output.endsWith(".mp4")) {
                        preview.innerHTML = `<video src="${output}" controls autoplay class="rounded-xl shadow-lg" style="max-width:100%"></video>`;
                    } else {
                        preview.innerHTML = `<img src="${output}" class="rounded-xl shadow-lg" style="max-width:100%">`;
                    }
                }

                if (status) status.innerText = "สถานะ: เสร็จสมบูรณ์ (SUCCESS)";

            } catch (e) {
                console.error("GENERATE ERROR:", e);
                if (status) status.innerText = `สถานะ: เกิดข้อผิดพลาด (${e.message})`;
                alert("Engine Error: " + e.message);
            } finally {
                btn.disabled = false;
                btn.innerText = originalBtnText;
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", initEngines);
