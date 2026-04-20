let socket = null;

// ฟังก์ชันช่วยเหลือสำหรับเปลี่ยนข้อความ (ป้องกันบั๊กหา Element ไม่เจอ)
function safeText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}

function initSocket(token) {
    // 1. เริ่มการเชื่อมต่อ
    socket = io(API_BASE, { 
        auth: { token }, 
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 5000
    });

    // 2. สถานะ: เชื่อมต่อสำเร็จ
    socket.on("connect", () => {
        const el = document.getElementById('socket-status');
        if(el) {
            el.innerHTML = '<div class="w-2 h-2 rounded-full bg-green-400 pulse-dot inline-block mr-2"></div> LIVE SYNC';
            el.className = 'px-4 py-2 bg-green-900/30 text-green-400 rounded-xl text-[10px] font-black border border-green-500/30';
        }
    });

    // 3. สถานะ: หลุดการเชื่อมต่อ
    socket.on("disconnect", () => {
        const el = document.getElementById('socket-status');
        if(el) {
            el.innerHTML = '<i class="fas fa-plug mr-2"></i> DISCONNECTED';
            el.className = 'px-4 py-2 bg-red-900/30 text-red-400 rounded-xl text-[10px] font-black border border-red-500/30';
        }
    });

    // 4. สถานะ: กำลังพยายามเชื่อมต่อใหม่
    socket.on("connect_error", () => {
        const el = document.getElementById('socket-status');
        if(el) {
            el.innerHTML = `<i class="fas fa-rotate fa-spin mr-2"></i> RETRYING...`;
            el.className = 'px-4 py-2 bg-amber-900/30 text-amber-400 rounded-xl text-[10px] font-black border border-amber-500/30';
        }
    });

    // 5. รับข้อมูลอัปเดตระบบแบบ Real-Time
    socket.on("system_update", (data) => {
        if(data.system){
            // อัปเดตกราฟ CPU / RAM
            if(window.sysChart) {
                window.sysChart.data.datasets[0].data.shift(); 
                window.sysChart.data.datasets[0].data.push(data.system.cpu || 0);
                
                window.sysChart.data.datasets[1].data.shift(); 
                window.sysChart.data.datasets[1].data.push(data.system.ram || 0);
                
                window.sysChart.update();
            }
            
            // อัปเดตตัวเลขเปอร์เซ็นต์
            safeText("sys-cpu", (data.system.cpu || 0) + "%");
            safeText("sys-ram", (data.system.ram || 0) + "%");
            safeText("sys-disk", (data.system.disk || 0) + "%");
            
            // อัปเดต Network
            let inBound = data.system.net_in || data.system.network_in || 0;
            let outBound = data.system.net_out || data.system.network_out || 0;
            safeText("net-in", parseFloat(inBound).toFixed(2) + " Mbps");
            safeText("net-out", parseFloat(outBound).toFixed(2) + " Mbps");
        }
        
        // ข้อมูล Users
        if(data.users){ 
            safeText("db-total-users", data.users.total || 0); 
            safeText("db-active-users", data.users.active_today || 0); 
        }
        
        // ข้อมูล Queue
        if(data.queue){
            safeText("q-pending", data.queue.pending || 0); 
            safeText("q-processing", data.queue.processing || 0);
            safeText("q-completed", data.queue.completed || 0); 
            safeText("q-failed", data.queue.failed || 0);
        }
    });

    // 6. อัปเดต Security Audit แบบ Real-Time
    socket.on("audit_update", (logs) => {
        renderAudit(logs);
    });
}

// 7. ฟังก์ชันวาดกล่องข้อความ Audit ลงบนจอ
function renderAudit(logs) {
    if(!Array.isArray(logs)) return;
    const list = document.getElementById("audit-list");
    if(!list) return;

    list.innerHTML = logs.map(r => {
        let color = 'text-gray-400';
        const st = String(r.status).toUpperCase();
        
        if(st.includes('OK') || st.includes('SUCCESS')) color = 'text-green-400';
        else if(st.includes('FAIL') || st.includes('DENY')) color = 'text-red-400';
        else if(st.includes('SCAN')) color = 'text-amber-400';

        const timeStr = new Date(r.time).toLocaleTimeString();
        const userStr = r.user || "System";
        const ipStr = String(r.ip || "").replace('::ffff:','');
        const statusStr = r.status || "-";

        return `
        <div class="bg-black/30 p-2.5 rounded-lg border border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-1 text-[10px] mono mb-2">
            <div class="flex items-center flex-wrap gap-2">
                <span class="text-gray-400"><i class="fa-regular fa-clock mr-1"></i>${timeStr}</span>
                <span class="text-blue-300 font-bold">${userStr}</span>
                <span class="text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">${ipStr}</span>
            </div>
            <div class="${color} font-bold tracking-wider">${statusStr}</div>
        </div>`;
    }).join("");
}

