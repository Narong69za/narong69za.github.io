const ROWS = 16;
const COLS = 16;
let mapData = [];

// 1. เริ่มต้นระบบเมื่อหน้าเว็บโหลดเสร็จ
window.onload = () => {
    // สร้างตารางเปล่าเริ่มต้น (ค่า 100 ทั้งหมด)
    mapData = Array.from({ length: ROWS }, () => Array(COLS).fill(100));
    renderTable();
    addLog("SN DESIGN TUNING: System Ready.");
};

// 2. ฟังก์ชันโหลดไฟล์จูน Binary (f_0000xx)
async function loadTuningFile(fileSuffix) {
    if(!fileSuffix) return;
    const fileName = `f_0000${fileSuffix}`;
    const filePath = `Core/Data/${fileName}`;
    
    addLog(`System: Loading binary data from ${fileName}...`);
    
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error("File not found");
        
        const buffer = await response.arrayBuffer();
        const rawData = new Uint8Array(buffer);
        
        // ดึงข้อมูล 256 bytes แรก (16x16) มาใส่ mapData
        mapData = [];
        for (let i = 0; i < ROWS; i++) {
            let row = [];
            for (let j = 0; j < COLS; j++) {
                row.push(rawData[i * COLS + j] || 0);
            }
            mapData.push(row);
        }
        
        renderTable();
        addLog(`Success: ${fileName} Loaded.`);
        
        // อัปเดตสถานะการเชื่อมต่อ
        const status = document.getElementById('connection-status');
        if(status) {
            status.innerText = "CONNECTED";
            status.style.background = "#00d2ff"; // สีน้ำเงินนีออน
            status.style.boxShadow = "0 0 10px #00d2ff";
        }
        
    } catch (err) {
        addLog(`Error: ไม่พบไฟล์ ${fileName} หรือไฟล์เสียหาย`);
    }
}

// 3. วาดตารางลงหน้าเว็บ (Render Table)
function renderTable() {
    const table = document.getElementById('tuning-map');
    if (!table) return;

    let html = '<thead><tr><th>kPa \\ RPM</th>';
    for (let c = 0; c < COLS; c++) html += `<th>${(c+1)*500}</th>`;
    html += '</tr></thead><tbody>';

    for (let i = 0; i < ROWS; i++) {
        html += `<tr><td style="background:#0f172a; color:#ff003c; font-weight:bold;">${(i+1)*10}</td>`;
        for (let j = 0; j < COLS; j++) {
            const val = mapData[i][j];
            html += `<td class="tune-cell" 
                        data-row="${i}" data-col="${j}"
                        style="background-color: ${getColor(val)};" 
                        onclick="toggleCell(this, ${val})">
                        ${val}
                    </td>`;
        }
        html += '</tr>';
    }
    html += '</tbody>';
    table.innerHTML = html;
}

// 4. จัดการการคลิกที่ช่องตาราง (Select & Update Monitor)
function toggleCell(el, val) {
    el.classList.toggle('selected');
    updateMonitor(val);
}

// 5. อัปเดตเกจ์ฝั่งขวา (AFR Target)
function updateMonitor(val) {
    const afrDisplay = document.getElementById('val-afr');
    if (afrDisplay) {
        // สูตรจำลองค่า AFR (ยิ่งเลขในตารางเยอะ น้ำมันยิ่งหนา AFR ยิ่งต่ำ)
        // กันหารด้วย 0
        const safeVal = val === 0 ? 1 : val;
        const simulatedAFR = (14.7 * (120 / safeVal)).toFixed(2);
        
        afrDisplay.innerText = simulatedAFR;
        
        // เปลี่ยนสีตามความหนา/บาง (Rich/Lean)
        if (simulatedAFR < 12.5) {
            afrDisplay.style.color = '#ff003c'; // สีแดง (Rich)
        } else if (simulatedAFR > 15.5) {
            afrDisplay.style.color = '#00d2ff'; // สีน้ำเงิน (Lean)
        } else {
            afrDisplay.style.color = '#4ade80'; // สีเขียว (Ideal)
        }
    }
}

// 6. คำนวณสี Heatmap (น้ำเงิน -> ม่วง -> แดง)
function getColor(val) {
    const ratio = Math.min(Math.max(val / 255, 0), 1);
    const hue = (1 - ratio) * 240; // 240 คือ Blue, 0 คือ Red
    return `hsla(${hue}, 80%, 50%, 0.35)`;
}

// 7. ปรับจูนค่า (+5% / -5%) สำหรับช่องที่เลือก
function adjustValue(multiplier) {
    const selected = document.querySelectorAll('td.selected');
    if(selected.length === 0) {
        addLog("Alert: โปรดเลือกช่องในตารางก่อนปรับค่าครับ");
        return;
    }
    
    selected.forEach(td => {
        const r = td.getAttribute('data-row');
        const c = td.getAttribute('data-col');
        
        let newVal = Math.round(mapData[r][c] * multiplier);
        if(newVal > 255) newVal = 255;
        if(newVal < 0) newVal = 0;
        
        mapData[r][c] = newVal;
        td.innerText = newVal;
        td.style.backgroundColor = getColor(newVal);
    });
    
    addLog(`System: ปรับจูนค่า ${selected.length} จุดเรียบร้อย`);
}

// 8. ระบบ Log Content
function addLog(msg) {
    const log = document.getElementById('log-content');
    if (log) {
        const time = new Date().toLocaleTimeString();
        log.innerHTML += `<div>[${time}] > ${msg}</div>`;
        log.scrollTop = log.scrollHeight;
    }
                 }
