const ROWS = 16;
const COLS = 16;
let mapData = [];

// ฟังก์ชันดึงค่าจากไฟล์จริงที่สกัดมาได้
async function loadTuningFile(fileSuffix) {
    if(!fileSuffix) return;
    const fileName = `f_0000${fileSuffix}`;
    const filePath = `Core/Data/${fileName}`;
    
    addLog(`System: Requesting binary data from ${fileName}...`);
    
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error("File not found");
        
        const buffer = await response.arrayBuffer();
        const rawData = new Uint8Array(buffer);
        
        // นำข้อมูล 256 bytes แรก (16x16) มาใส่ตาราง
        mapData = [];
        for (let i = 0; i < ROWS; i++) {
            let row = [];
            for (let j = 0; j < COLS; j++) {
                // อ่านค่าทีละ Byte จากไฟล์ Binary
                row.push(rawData[i * COLS + j] || 0);
            }
            mapData.push(row);
        }
        
        renderTable();
        addLog(`Success: Loaded 256 bytes from ${fileName}`);
        document.getElementById('connection-status').style.background = "#4ade80";
        document.getElementById('connection-status').innerText = "CONNECTED";
        
    } catch (err) {
        addLog(`Error: Cannot load ${fileName}. Make sure the file exists in Core/Data/`);
    }
}

function renderTable() {
    const table = document.getElementById('tuning-map');
    let html = '<thead><tr><th>RPM</th>';
    for (let c = 0; c < COLS; c++) html += `<th>${(c+1)*500}</th>`;
    html += '</tr></thead><tbody>';

    for (let i = 0; i < ROWS; i++) {
        html += `<tr><td style="background:#1e293b; font-weight:bold;">${(i+1)*10}</td>`;
        for (let j = 0; j < COLS; j++) {
            const val = mapData[i][j];
            html += `<td style="background-color: ${getColor(val)};" onclick="this.classList.toggle('selected')">${val}</td>`;
        }
        html += '</tr>';
    }
    html += '</tbody>';
    table.innerHTML = html;
}

function getColor(val) {
    // คำนวณสีแบบ Heatmap (0=น้ำเงิน, 255=แดง)
    const ratio = val / 255;
    const hue = (1 - ratio) * 240; 
    return `hsla(${hue}, 70%, 50%, 0.4)`;
}

function addLog(msg) {
    const log = document.getElementById('log-content');
    log.innerHTML += `<div>> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function adjustValue(multiplier) {
    const selected = document.querySelectorAll('td.selected');
    if(selected.length === 0) {
        addLog("Alert: Please select cells first!");
        return;
    }
    selected.forEach(td => {
        let current = parseInt(td.innerText);
        td.innerText = Math.round(current * multiplier);
        td.style.backgroundColor = getColor(parseInt(td.innerText));
    });
    addLog(`Modified ${selected.length} values.`);
}

// เริ่มต้นด้วยตารางเปล่า
window.onload = () => {
    mapData = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    renderTable();
    addLog("SN DESIGN TUNING: Initialized.");
};
