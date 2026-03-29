/**
=====================================================
PROJECT: SN DESIGN STUDIO | MODULE: create.js
VERSION: v9.9.1 (Centralized Config Fixed)
STATUS: production-final
=====================================================
*/
import {buildPayload} from "./payload.builder.js"
import {pollTask} from "./task.poller.js"
import {uploadFile} from "./upload.service.js"
import {logTask} from "./db.logger.js"

// ดึงค่า URL กลางจาก CONFIG
const API_BASE = window.CONFIG ? window.CONFIG.API_BASE_URL : "https://api.sn-designstudio.dev";

const CREDIT_RATE = { 720: 2, 1080: 4 };

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

    /* FILE PREVIEW */
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
                preview.innerHTML = `<img src="${url}" style="max-width:100%">`;
            } else if (file.type.startsWith("video")) {
                preview.innerHTML = `<video src="${url}" controls style="max-width:100%"></video>`;
            } else if (file.type.startsWith("audio")) {
                preview.innerHTML = `<audio src="${url}" controls></audio>`;
            }
        });
    });

    /* GENERATE ENGINE (CTA BUTTON FIX) */
    document.querySelectorAll(".generate-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const engine = btn.closest(".engine-box");
            if (!engine) return;

            const cta = engine.dataset.engine;
            const prompt = engine.querySelector(".engine-prompt")?.value || "";
            const resolution = engine.querySelector(".engine-resolution")?.value || "720";
            const file = engine.querySelector(".engine-fileA")?.files?.[0] || null;
            const preview = engine.querySelector(".engine-preview");
            const status = document.getElementById("status");

            if (status) status.innerText = "สถานะ: กำลังประมวลผล (GENERATING...)";

            try {
                let image = null, video = null, audio = null;

                if (file) {
                    const upload = await uploadFile(file);
                    if (file.type.startsWith("image")) image = upload.runwayUri || upload.url;
                    if (file.type.startsWith("video")) video = upload.runwayUri || upload.url;
                    if (file.type.startsWith("audio")) audio = upload.runwayUri || upload.url;
                }

                const payload = buildPayload(cta, {
                    prompt, image, video, audio,
                    ratio: "1280:720", duration: 5
                });

                /* FIXED: Added backticks and CONFIG reference */
                const res = await fetch(`${API_BASE}/api/render`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                if (!res.ok) throw new Error("API GENERATE FAILED");

                const task = await res.json();
                const result = await pollTask(task.id);
                logTask(result);

                if (preview) {
                    const output = result?.output?.[0];
                    if (!output) return;
                    if (output.endsWith(".mp4")) {
                        preview.innerHTML = `<video src="${output}" controls style="max-width:100%"></video>`;
                    } else if (/\.(png|jpg|jpeg)$/i.test(output)) {
                        preview.innerHTML = `<img src="${output}" style="max-width:100%">`;
                    } else if (/\.(mp3|wav)$/i.test(output)) {
                        preview.innerHTML = `<audio src="${output}" controls></audio>`;
                    }
                }

                if (status) status.innerText = "สถานะ: เสร็จสมบูรณ์ (RENDER COMPLETE)";

            } catch (e) {
                console.error("GENERATE ERROR:", e);
                if (status) status.innerText = "สถานะ: เกิดข้อผิดพลาด (ERROR)";
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", initEngines);

