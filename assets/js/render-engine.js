/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: render-engine.js (PROGRESS TRACKER)
 * VERSION: v9.0.0 (CLEAN & UNBLOCKED)
 * STATUS: production
 * LAYER: RENDER-PROGRESS
 * * RESPONSIBILITY:
 * - Track rendering progress 
 * - Convert task status → UI progress
 * - Update progress bar (No Security/Auth Logic)
 * =====================================================
 */

// 📊 ตารางสถานะงาน (Mapping Status → Percent)
const STATUS_PROGRESS = {
    "PENDING": 10,
    "STARTING": 20,
    "RUNNING": 50,
    "PROCESSING": 75,
    "SUCCEEDED": 100,
    "COMPLETED": 100,
    "DONE": 100,
    "FAILED": 100
};

/**
 * ดึงตัวเลขเปอร์เซ็นต์จากสถานะ
 */
export function getProgress(status) {
    const s = status ? status.toUpperCase() : "PENDING";
    return STATUS_PROGRESS[s] || 5; 
}

/**
 * 🔓 [BYPASS MODE]: อัปเดตแถบ Progress ทันทีโดยไม่เช็ค Security
 */
export function updateProgressBar(status) {
    const bar = document.getElementById("renderProgress");
    const text = document.getElementById("renderStatus");

    if (!bar) return;

    const progress = getProgress(status);

    // ปรับความกว้างแถบสี
    bar.style.width = progress + "%";

    // อัปเดตข้อความสถานะ
    if (text) {
        text.innerText = `${status} ${progress}%`;
        
        // ถ้างานเสร็จ (Succeeded/Completed/Done) ให้เปลี่ยนเป็นสี Cyan ตามธีม
        if (progress === 100 && status !== "FAILED") {
            bar.style.background = "#00ffd5"; 
            text.style.color = "#00ffd5";
        }
        
        // ถ้างานล้มเหลว
        if (status === "FAILED") {
            bar.style.background = "#ff4d4d";
            text.style.color = "#ff4d4d";
        }
    }
}

/**
 * 🛠️ ฟังก์ชันสร้าง UI Progress Bar (ยัดใส่ในกล่อง Preview ของ Engine)
 */
export function createProgressUI(engine) {
    if (!engine) return;

    // หาจุดที่จะวาง (ถ้าไม่มี .engine-preview ให้วางที่ตัว engine เลย)
    const box = engine.querySelector(".engine-preview") || engine;
    
    // ป้องกันการสร้างซ้ำ
    if (box.querySelector(".progress-container")) return;

    const container = document.createElement("div");
    container.className = "progress-container";
    container.style.marginTop = "15px";

    container.innerHTML = `
        <div class="progress-bar-bg" style="background: rgba(255,255,255,0.05); height: 8px; border-radius: 10px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
            <div id="renderProgress" class="progress-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #6a1b9a, #9c27b0); transition: width 0.4s ease;"></div>
        </div>
        <div id="renderStatus" style="font-size: 11px; color: #888; margin-top: 6px; text-align: center; font-weight: bold; letter-spacing: 1px;">IDLE</div>
    `;

    box.appendChild(container);
    console.log("🔓 [RENDER-ENGINE]: UI Progress Injected (Bypass Active)");
}
