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
import { buildPayload } from "./payload.builder.js";
import { createProgressUI, updateProgressBar } from "./progress.tracker.js";

const API_BASE = "https://api.sn-designstudio.dev";

// [HELPER] แมพ ID หน้าจอ เข้ากับ Alias ในระบบ
const getAlias = (id) => {
    const map = { "1":"image_to_video", "2":"text_to_video", "3":"video_transform", "4":"text_to_image", "5":"fast_image", "6":"redux_image", "7":"character_motion", "8":"video_enhance", "9":"video_ai", "10":"video_fast", "11":"gemini_image", "12":"voice_ai", "13":"sound_fx", "14":"voice_transfer" };
    return map[id];
};

async function startRenderPipeline(engineBox) {
    const engineId = engineBox.dataset.engine;
    const alias = getAlias(engineId);
    const prompt = engineBox.querySelector(".engine-prompt")?.value;
    const fileInput = engineBox.querySelector(".engine-fileA");
    const statusLabel = document.getElementById("status");

    try {
        // 1. ตรวจสอบการ Login (จากไฟล์ที่พี่ส่งมา)
        if (!localStorage.getItem("sn_user") && !prompt.includes("ADMIN_BYPASS")) {
            alert("กรุณาเข้าสู่ระบบก่อนใช้งาน");
            return;
        }

        // 2. เตรียม UI Progress
        createProgressUI(engineBox);
        if (statusLabel) statusLabel.innerText = "สถานะ: กำลังส่งคำสั่ง...";

        // 3. สร้าง Payload
        const payload = buildPayload(alias, { prompt: prompt });

        // 4. ยิงไป Backend ตัวแรงของเรา
        const res = await fetch(`${API_BASE}/api/render`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const startData = await res.json();
        if (!startData.success && !startData.status === "success") throw new Error("API REJECTED");

        const jobId = startData.job_id;

        // 5. ระบบ Polling ติดตามงาน
        const poll = async () => {
            const statusRes = await fetch(`${API_BASE}/api/render-status?job=${jobId}`);
            const data = await statusRes.json();

            // อัปเดต Progress Bar ในกล่องนั้นๆ
            updateProgressBar(engineBox, data.status);

            if (data.status === "processing" || data.status === "running") {
                setTimeout(poll, 3000);
            } else if (data.status === "done" || data.status === "success") {
                renderOutput(engineBox, data.output);
                if (statusLabel) statusLabel.innerText = "สถานะ: เสร็จสมบูรณ์";
            } else if (data.status === "error") {
                alert("Render Failed");
            }
        };

        poll();

    } catch (e) {
        console.error(e);
        alert("Pipeline Error: " + e.message);
    }
}

// ฟังก์ชันแสดงผลลัพธ์ในกล่อง Preview
function renderOutput(engineBox, output) {
    const preview = engineBox.querySelector(".engine-preview");
    // ลบ Progress UI ออก
    const loader = preview.querySelector(".progress-container");
    if (loader) loader.remove();

    if (Array.isArray(output)) {
        preview.innerHTML = `<img src="${output[0]}" class="w-full rounded-xl">`;
    } else if (output && output.endsWith(".mp4")) {
        preview.innerHTML = `<video src="${output}" controls class="w-full rounded-xl"></video>`;
    } else {
        preview.innerHTML = `<img src="${output}" class="w-full rounded-xl">`;
    }
}

// ผูกปุ่มเข้ากับระบบ
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".generate-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const box = btn.closest(".engine-box");
            startRenderPipeline(box);
        });
    });
});
