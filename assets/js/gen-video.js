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
