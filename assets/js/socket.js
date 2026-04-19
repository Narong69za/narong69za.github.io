"use strict";

// ==========================================
// WEBSOCKET & REAL-TIME SYNC
// ==========================================
function initSocket(token) {
    // กำหนดค่าการเชื่อมต่อและ Auto Reconnect
    STATE.socket = io(ENV.API_BASE, { 
        auth: { token }, 
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 5000
    });

    // เมื่อเชื่อมต่อสำเร็จ
    STATE.socket.on("connect", () => {
        STATE.reconnectAttempts = 0;
        const el = qs('socket-status');
        if(el) {
            el.innerHTML = '<div class="w-2 h-2 rounded-full bg-green-400 pulse-dot inline-block mr-2"></div> LIVE SYNC';
            el.className = 'px-4 py-2 bg-green-900/30 text-green-400 rounded-xl text-[10px] font-black border border-green-500/30';
        }
    });

    // เมื่อเน็ตหลุด หรือ Server ตัดการเชื่อมต่อ
    STATE.socket.on("disconnect", () => {
        const el = qs('socket-status');
        if(el) {
            el.innerHTML = '<i class="fas fa-plug mr-2"></i> DISCONNECTED';
            el.className = 'px-4 py-2 bg-red-900/30 text-red-400 rounded-xl text-[10px] font-black border border-red-500/30';
        }
    });

    // เมื่อพยายาม Reconnect
    STATE.socket.on("connect_error", () => {
        STATE.reconnectAttempts++;
        const el = qs('socket-status');
        if(el) {
            el.innerHTML = `<i class="fas fa-rotate fa-spin mr-2"></i> RETRYING (${STATE.reconnectAttempts})`;
            el.className = 'px-4 py-2 bg-amber-900/30 text-amber-400 rounded-xl text-[10px] font-black border border-amber-500/30';
        }
    });

    // อัปเดตข้อมูล System, Database, และ Queue แบบ Real-time
    STATE.socket.on("system_update", (data) => {
        // กราฟ CPU / RAM
        if(data.system && STATE.sysChart){
            STATE.sysChart.data.datasets[0].data.shift(); 
            STATE.sysChart.data.datasets[0].data.push(data.system.cpu || 0);
            
            STATE.sysChart.data.datasets[1].data.shift(); 
            STATE.sysChart.data.datasets[1].data.push(data.system.ram || 0);
            
            STATE.sysChart.update();
            
            safeText("sys-disk", (data.system.disk || 0) + "%");
            safeText("sys-net", (data.system.network || 0) + " mbps");
        }
        
        // ข้อมูลจำนวน User ใน DB
        if(data.users){ 
            safeText("db-total-users", data.users.total || 0); 
            safeText("db-active-users", data.users.active_today || 0); 
        }
        
        // ข้อมูลคิวการเรนเดอร์
        if(data.queue){
            safeText("q-pending", data.queue.pending || 0); 
            safeText("q-processing", data.queue.processing || 0);
            safeText("q-completed", data.queue.completed || 0); 
            safeText("q-failed", data.queue.failed || 0);
        }
    });

    // อัปเดตข้อมูล Security Audit Live
    STATE.socket.on("audit_update", (logs) => {
        renderAudit(logs);
    });
}

// ฟังก์ชัน Render กล่องข้อความ Audit ให้ออกมาเป็นแนวนอน
function renderAudit(logs) {
    if(!Array.isArray(logs)) return;
    const list = qs("audit-list");
    if(!list) return;

    list.innerHTML = logs.map(r => {
        let color = 'text-gray-400';
        const st = String(r.status).toUpperCase();
        
        // ตรวจจับสถานะเพื่อเปลี่ยนสี Text
        if(st.includes('OK') || st.includes('SUCCESS')) color = 'text-green-400';
        else if(st.includes('FAIL') || st.includes('DENY')) color = 'text-red-400';
        else if(st.includes('SCAN')) color = 'text-amber-400';

        // สร้าง HTML ทีละกล่อง
        return `
        <div class="bg-black/30 p-2.5 rounded-lg border border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-1 text-[10px] mono mb-2">
            <div class="flex items-center flex-wrap gap-2">
                <span class="text-gray-400"><i class="fa-regular fa-clock mr-1"></i>${sanitizeHTML(new Date(r.time).toLocaleTimeString())}</span>
                <span class="text-blue-300 font-bold">${sanitizeHTML(r.user || "System")}</span>
                <span class="text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">${sanitizeHTML(String(r.ip).replace('::ffff:',''))}</span>
            </div>
            <div class="${color} font-bold tracking-wider">${sanitizeHTML(r.status || "-")}</div>
        </div>`;
    }).join("");
}

