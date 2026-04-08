#!/bin/bash
# =====================================================
# � SN-ULTRA: FRONTEND FINAL MASTER SYNC
# รันใน: /root/narong69za.github.io
# เป้าหมาย: สร้างไฟล์หน้าบ้านให้เชื่อมต่อ API 5002 ได้จริง
# =====================================================

FRONT_DIR="/root/narong69za.github.io"
mkdir -p $FRONT_DIR/assets/js

echo "� [1/5] สร้าง index.html (หน้า Dashboard Monitor)..."
cat << 'EOF' > $FRONT_DIR/index.html
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SN ULTRA — COMMAND MONITOR</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'JetBrains Mono', monospace; background: #020408; color: #94a3b8; }
        .glass { background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(0, 255, 213, 0.1); }
        .status-card { transition: 0.4s ease; border: 1px solid rgba(255,255,255,0.02); border-radius: 2.5rem; }
        .status-card:hover { border-color: #00ffd5; box-shadow: 0 0 30px rgba(0, 255, 213, 0.15); }
    </style>
</head>
<body class="p-6 pt-28">
    <div id="nav-placeholder"></div>
    <main id="pm2-container" class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="col-span-full py-20 text-center opacity-30 text-xs italic tracking-widest">CONNECTING TO MASTER ENGINE...</div>
    </main>
    <script src="assets/js/nav.js"></script>
    <script>
        // ดึงข้อมูลจากพอร์ต 5002 โดยตรง
        const API_STATUS = "http://147.93.159.30:5002/api/admin/system-status";
        async function fetchStatus() {
            try {
                const res = await fetch(API_STATUS);
                const data = await res.json();
                if (data.success && data.monitor.pm2) {
                    document.getElementById('pm2-container').innerHTML = data.monitor.pm2.map(s => `
                        <div class="status-card glass p-8 flex flex-col gap-4">
                            <div class="flex justify-between items-center">
                                <span class="text-[10px] font-black text-[#00ffd5] uppercase">${s.name}</span>
                                <div class="w-2 h-2 rounded-full bg-[#00ffd5] shadow-[0_0_10px_#00ffd5] animate-pulse"></div>
                            </div>
                            <div class="text-3xl font-black text-white">${s.cpu}%</div>
                            <div class="text-[9px] opacity-50 uppercase font-bold tracking-tighter">
                                MEM: ${s.mem} | ${s.status.toUpperCase()}
                            </div>
                        </div>
                    `).join('');
                }
            } catch (e) { 
                console.error("Monitor Error:", e);
                document.getElementById('pm2-container').innerHTML = "<div class='col-span-full text-center text-red-500 text-xs uppercase'>❌ Master Engine Offline (Check Port 5002)</div>"; 
            }
        }
        setInterval(fetchStatus, 3000); fetchStatus();
    </script>
</body>
</html>
EOF

echo "� [2/5] สร้าง gen-video.html (UI สำหรับ 16 Engines)..."
cat << 'EOF' > $FRONT_DIR/gen-video.html
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'JetBrains Mono', monospace; background: #020408; color: #fff; }
        .glass { background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.03); }
        .engine-card { border-radius: 3rem; transition: 0.4s; border: 1px solid rgba(255,255,255,0.03); }
        .engine-card:hover { border-color: #3b82f6; transform: translateY(-5px); }
        .gen-btn { background: linear-gradient(135deg, #1e40af, #3b82f6); box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.4); }
    </style>
</head>
<body class="p-6 pt-28">
    <div id="nav-placeholder"></div>
    <div id="video-grid" class="max-w-[1700px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"></div>
    <script src="assets/js/nav.js"></script>
    <script src="assets/js/gen-video.js"></script>
</body>
</html>
EOF

echo "� [3/5] สร้าง assets/js/gen-video.js (ตัวคุม Logic 16 Engines)..."
cat << 'EOF' > $FRONT_DIR/assets/js/gen-video.js
const engines = [
    { id: 1, name: "Flux.1 Video", alias: "flux_video" }, { id: 2, name: "Runway Gen-3", alias: "runway_g3" },
    { id: 3, name: "Luma Dream Machine", alias: "luma_dream" }, { id: 4, name: "Kling AI Master", alias: "kling_pro" },
    { id: 5, name: "Pika Art v2", alias: "pika_v2" }, { id: 6, name: "Stable Video", alias: "svd_xt" },
    { id: 7, name: "Live Portrait Pro", alias: "live_port" }, { id: 8, name: "LipSync Master", alias: "sync_v2" },
    { id: 9, name: "Vid-Enhance 4K", alias: "upscale_v4" }, { id: 10, name: "Morph AI Magic", alias: "morph_v1" },
    { id: 11, name: "Gemini Vision AI", alias: "gemini_v" }, { id: 12, name: "DeepSeek Logic", alias: "ds_video" },
    { id: 13, name: "AnimateDiff Pro", alias: "animate_diff" }, { id: 14, name: "FaceSwap Elite", alias: "f_swap" },
    { id: 15, name: "Ego Motion POV", alias: "ego_v1" }, { id: 16, name: "SkyBox 360", alias: "sky_360" }
];

const grid = document.getElementById('video-grid');
if(grid) {
    grid.innerHTML = engines.map(e => `
        <div class="engine-card glass p-8 flex flex-col gap-5">
            <div class="flex justify-between items-center">
                <span class="text-[10px] font-black text-blue-500 tracking-widest uppercase">${e.name}</span>
                <span class="text-[9px] text-slate-600 italic uppercase">v3.0</span>
            </div>
            <div class="aspect-video bg-black/40 rounded-3xl border border-white/5 flex items-center justify-center text-[9px] text-slate-800 uppercase tracking-tighter">Awaiting System Command</div>
            <textarea id="prompt-${e.id}" class="bg-slate-950/50 border border-white/5 rounded-2xl p-4 text-xs h-24 outline-none focus:border-blue-500 transition-all" placeholder="Enter Generation Logic..."></textarea>
            <button onclick="handleGenerate('${e.alias}', ${e.id})" class="gen-btn py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase text-white hover:brightness-110 active:scale-95 transition-all">Generate Video</button>
        </div>
    `).join('');
}

async function handleGenerate(alias, id) {
    const prompt = document.getElementById(`prompt-${id}`).value;
    console.log("� Executing Engine:", alias);
    // ยิง API ไปที่ Port 5002
    try {
        const res = await fetch("http://147.93.159.30:5002/api/render", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ alias, engine_id: id, prompt })
        });
        const data = await res.json();
        alert("System Result: " + (data.message || "Request Sent"));
    } catch(e) { alert("Engine Connection Failed."); }
}
EOF

echo "� [4/5] สร้าง assets/js/nav.js (ระบบเมนูนำทาง)..."
cat << 'EOF' > $FRONT_DIR/assets/js/nav.js
document.addEventListener("DOMContentLoaded", function() {
    const navHTML = `
    <header class="fixed top-0 left-0 w-full z-[200] p-6">
        <nav class="max-w-7xl mx-auto glass rounded-full px-10 py-5 flex justify-between items-center border border-white/5 shadow-2xl">
            <div class="text-white font-black italic tracking-tighter text-xl uppercase">SN ULTRA <span class="text-[#00ffd5]">CORE</span></div>
            <div class="flex gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                <a href="index.html" class="hover:text-[#00ffd5] transition-colors">Monitor</a>
                <a href="gen-video.html" class="hover:text-blue-500 transition-colors">Video AI</a>
                <a href="templates.html" class="hover:text-white transition-colors">Templates</a>
            </div>
        </nav>
    </header>
    `;
    const placeholder = document.getElementById("nav-placeholder");
    if(placeholder) placeholder.innerHTML = navHTML;
    else document.body.insertAdjacentHTML("afterbegin", navHTML);
});
EOF

echo "� [5/5] สร้าง gen-image.html ( UI สำหรับรูปภาพ)..."
cat << 'EOF' > $FRONT_DIR/gen-image.html
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8"><script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'JetBrains Mono', monospace; background: #020408; color: #fff; }
        .glass { background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(0, 255, 213, 0.1); }
    </style>
</head>
<body class="p-6 pt-28">
    <div id="nav-placeholder"></div>
    <div class="max-w-4xl mx-auto glass p-12 rounded-[4rem] text-center border border-emerald-500/20">
        <h2 class="text-3xl font-black mb-8 text-emerald-500 uppercase italic">Image Generation Core</h2>
        <textarea class="w-full bg-black/40 border border-white/5 rounded-[2.5rem] p-8 text-sm h-40 outline-none focus:border-emerald-500 transition-all" placeholder="Enter Visual Imagination..."></textarea>
        <button class="mt-8 w-full py-6 bg-emerald-600 rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs hover:bg-emerald-500 transition-all">Unleash AI Image</button>
    </div>
    <script src="assets/js/nav.js"></script>
</body>
</html>
EOF

chmod -R 755 $FRONT_DIR
echo "------------------------------------------------"
echo "✅ SUCCESS: ทุกไฟล์หน้าบ้านถูกเขียนใหม่หมดแล้ว!"
echo "� พิกัดไฟล์: $FRONT_DIR"
echo "------------------------------------------------"
