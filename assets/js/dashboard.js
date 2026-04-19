// ดึงข้อมูล Credits จาก DB จริง
async function fetchEngineCredits() {
    try {
        const res = await apiFetch('/api/billing/usage', 'GET'); // ตรวจสอบ Endpoint ให้ตรงกับ Backend คุณ
        if(res && res.success && res.rows) {
            let runway = 0, replicate = 0, gemini = 0, eleven = 0;
            res.rows.forEach(r => {
                const s = String(r.service).toLowerCase();
                if(s.includes('runway')) runway += r.total;
                if(s.includes('replicate')) replicate += r.total;
                if(s.includes('gemini')) gemini += r.total;
                if(s.includes('eleven')) eleven += r.total;
            });
            safeText('cr-runway', '$' + runway.toFixed(2));
            safeText('cr-replicate', '$' + replicate.toFixed(2));
            safeText('cr-gemini', '$' + gemini.toFixed(2));
            safeText('cr-eleven', eleven.toFixed(0));
        } else {
            // ดึงจาก .env (จำลองผ่าน API config ถ้า DB ไม่มี)
            console.warn("No DB usage found, using defaults.");
        }
    } catch(e) { console.error("Credits Sync Error:", e); }
}

// ดึงข้อมูล Security Audit ย้อนหลังของจริงมาโชว์
async function fetchAuditLogs() {
    try {
        const res = await apiFetch('/api/system/audit', 'GET'); // ตรวจสอบ Endpoint ให้ตรงกับ Backend
        if(res && res.success && res.logs) {
            if(typeof renderAudit === 'function') renderAudit(res.logs);
        }
    } catch(e) { console.error("Audit Sync Error:", e); }
}

// โหลดข้อมูลทั้งหมดเมื่อเข้าเว็บ
window.onload = () => {
    const token = getAuthToken(); // เรียกใช้จาก auth.js
    if(token) {
        document.getElementById("login-overlay").style.display = "none";
        // รันฟังก์ชันดึงข้อมูลจริงทันที
        bootChart();
        fetchEngineCredits();
        fetchAuditLogs();
        if(typeof initSocket === 'function') initSocket(token);
    } else {
        document.getElementById("login-overlay").style.display = "flex";
    }
};

