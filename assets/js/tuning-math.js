const ROWS = 16;
const COLS = 16;
let mapData = [];

// 1. สร้างตารางเริ่มต้น
function initMap() {
    // สร้างข้อมูลจำลอง (หรือดึงจากไฟล์)
    mapData = Array.from({ length: ROWS }, () => 
        Array.from({ length: COLS }, () => Math.floor(Math.random() * 100) + 100)
    );
    renderTable();
    addLog("System: Map Initialized. Ready for tuning.");
}

// 2. แสดงผลตารางลงใน ID "tuning-map"
function renderTable() {
    const table = document.getElementById('tuning-map');
    if (!table) return;

    let html = '';
    // สร้าง Header Column (RPM/Load)
    html += '<thead><tr><th>Load \\ RPM</th>';
    for (let c = 0; c < COLS; c++) html += `<th>\${(c + 1) * 500}</th>`;
    html += '</tr></thead><tbody>';

    for (let i = 0; i < ROWS; i++) {
        html += '<tr>';
        html += `<td class="axis-label">\${(i + 1) * 10} kPa</td>`; // Label แถว
        for (let j = 0; j < COLS; j++) {
            const val = mapData[i][j];
            const color = getColor(val);
            html += `<td style="background-color: \${color};" contenteditable="true" onblur="updateValue(\${i},\${j},this.innerText)">\${val}</td>`;
        }
        html += '</tr>';
    }
    html += '</tbody>';
    table.innerHTML = html;
}

// 3. ฟังก์ชันปรับค่า +5% / -5% (ที่ปุ่มใน HTML เรียกใช้)
function adjustValue(multiplier) {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            mapData[i][j] = Math.round(mapData[i][j] * multiplier);
        }
    }
    renderTable();
    addLog(`Adjusted Map by \${(multiplier > 1 ? '+5%' : '-5%')}`);
}

// 4. ระบบ Log
function addLog(msg) {
    const log = document.getElementById('log-content');
    if (log) {
        const time = new Date().toLocaleTimeString();
        log.innerHTML += `<div>[\${time}] \${msg}</div>`;
        log.scrollTop = log.scrollHeight;
    }
}

// ฟังก์ชันคำนวณสี (ให้เหมือนโปรแกรมจูน)
function getColor(val) {
    const hue = (1 - (val - 100) / 150) * 240; // สีน้ำเงินไปแดง
    return `hsla(\${hue}, 70%, 50%, 0.3)`;
}

window.onload = initMap;
        
