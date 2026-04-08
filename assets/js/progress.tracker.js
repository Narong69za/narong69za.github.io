/* =====================================================
VERSION: v10.0.0 (MASTER SYNC)
===================================================== */

const STATUS_PROGRESS = {
    "PENDING": 10,
    "STARTING": 20,
    "RUNNING": 50,
    "PROCESSING": 70,
    "test_success": 100, // รองรับโหมดเทส
    "SUCCEEDED": 100,
    "done": 100,
    "FAILED": 100,
    "error": 100
};

export function getProgress(status) {
    return STATUS_PROGRESS[status] || 0;
}

// แก้ไขให้รับ engineBox เข้ามาเพื่อระบุตำแหน่งที่ถูกต้อง
export function updateProgressBar(engineBox, status) {
    const bar = engineBox.querySelector(".progress-bar");
    const text = engineBox.querySelector(".render-status-text");

    if (!bar) return;

    const progress = getProgress(status);
    bar.style.width = progress + "%";

    if (text) {
        text.innerText = status.toUpperCase() + " " + progress + "%";
        // เปลี่ยนสีตามสถานะ
        if (status === "done" || status === "SUCCEEDED") text.style.color = "#00ff88";
        if (status === "error" || status === "FAILED") text.style.color = "#ff4444";
    }
}

// สร้าง UI Progress แบบ Premium Glassmorphism
export function createProgressUI(engineBox) {
    const previewArea = engineBox.querySelector(".engine-preview");
    if (!previewArea) return;

    // ลบของเก่าถ้ามี
    const oldContainer = previewArea.querySelector(".progress-container");
    if (oldContainer) oldContainer.remove();

    const container = document.createElement("div");
    container.className = "progress-container absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm p-6 z-10";
    
    container.innerHTML = `
        <div class="w-full max-w-[200px]">
            <div class="flex justify-between mb-2">
                <span class="render-status-text text-[10px] font-bold tracking-widest text-blue-400">INITIALIZING...</span>
            </div>
            <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div class="progress-bar bg-gradient-to-r from-blue-500 to-purple-600 h-full w-[10%] transition-all duration-500"></div>
            </div>
        </div>
    `;

    previewArea.style.position = "relative";
    previewArea.appendChild(container);
}
