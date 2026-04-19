async function controlHamster(action) {
    try {
        const res = await apiFetch(`/api/hamster/${action}`, 'POST');
        if(!res.success) showToast(res.msg || "Error", "error");
    } catch(e) {
        showToast("เชื่อมต่อ API ไม่ได้", "error");
    }
}

// ฟังก์ชันแปะ Log ลงหน้าจอ (ตัวรับข้อมูลจริง)
function appendHmTerminal(text, type) {
    const term = document.getElementById('hmTerminal');
    if(!term) return;

    const line = document.createElement('div');
    // ปรับสีตามประเภท Error หรือ Info
    line.className = `termux-line truncate ${type === 'error' ? 'text-red-400' : 'text-cyan-400'}`;
    line.innerText = `> ${text.trim()}`;
    term.appendChild(line);
    
    // รักษาความลื่นไหล (เก็บแค่ 100 บรรทัดล่าสุด)
    while (term.childElementCount > 100) term.removeChild(term.firstChild);
    term.scrollTop = term.scrollHeight;
}

